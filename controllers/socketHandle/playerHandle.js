import gameManager from "../../utils/class/GameManager.js";
import { hostHandle } from "./index.js";

const playerHandle = (io, socket) => {
  const joinRoom = async (payload) => {
    const room = payload.room;

    const game = gameManager.getGame(room);
    if (game) {
      const player = {
        id: socket.id,
        room,
        name: payload.name,
        score: 0,
      };

      if (game.havePlayer(player.id)) {
        socket.emit("joinRoomRes", {
          result: false,
          msg: "You are already in the room",
        });
        return;
      }

      if (game.havePlayerName(player.name)) {
        socket.emit("joinRoomRes", {
          result: false,
          msg: "This name is already taken",
        });
        return;
      }

      game.addPlayerToGame(player);

      socket.join(room);

      // Save player data into socket to handle disconnect
      socket.player = { ...player, host: game.getHost() };

      // Send res if player join success or not
      io.to(socket.id).emit("joinRoomRes", {
        result: true,
        msg: "Joined successfully",
        player,
      });

      sendAllPlayersInfoInRoom(room);
    } else {
      io.to(socket.id).emit("joinRoomRes", {
        result: false,
        msg: "Room not found",
      });
    }
  };

  const sendAllPlayersInfoInRoom = (room) => {
    const game = gameManager.getGame(room);
    if (game) {
      const playersInRoom = game.getPlayersInGame();
      io.to(game.host).emit("receive__players", playersInRoom);
    }
  };

  const answer = (playerId, questionId, answerContent, index) => {
    const game = gameManager.getGameWithPlayer(playerId);
    if (game) {
      const newList = game.updatePlayerAnswer(
        playerId,
        questionId,
        answerContent,
        index
      );

      const playerInfo = game.getPlayer(playerId);
      io.to(game.host).emit("playerAnswerRes", newList);
      io.to(socket.id).emit("updatePlayerInfo", playerInfo);

      console.log("Players in room: ", game.getPlayersInGame().length);
      console.log("Player answer: ", newList.playerAnswers.length);

      if (game.getPlayersInGame().length === newList.playerAnswers.length) {
        console.log("All player answered the question");
        io.to(game.room).emit("questionTimeOut");
      }
    }
  };

  const playerDisconnect = () => {
    const game = gameManager.getGameWithPlayer(socket.id);
    if (game) {
      game.removePlayer(socket.id);
      sendAllPlayersInfoInRoom(game.room);
    }
  };

  socket.on("joinRoom", joinRoom);
  socket.on("playerAnswer", answer);
  socket.on("disconnect", playerDisconnect);
};
export default playerHandle;
