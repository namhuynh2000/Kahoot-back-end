import { getAllQuizFromDB, getGameFromDB } from "../../models/server.model.js";
import Game from "../../utils/class/game.js";
const hostHandle = (io, socket, gameManager) => {
  const fetchQuizList = async () => {
    const list = getAllQuizFromDB();
    io.to(socket.id).emit("fetchQuizListRes", list);
  };

  const createGame = () => {};

  const hostGame = (id) => {
    // Load game from database
    const game = getGameFromDB(id);

    if (game) {
      const room = gameManager.getNextAvailableId();
      const newGame = new Game(room, socket.id);

      socket.host = { id: socket.id, room };
      gameManager.addGame(newGame);

      io.to(socket.id).emit("hostGameRes", {
        result: true,
        msg: "Host successfully",
        game: newGame,
      });
    } else {
      io.to(socket.id).emit("hostGameRes", {
        result: false,
        msg: "Host failed",
      });
    }
  };

  const sendAllPlayersInfoInRoom = (room) => {
    const game = gameManager.getGame(room);
    if (game) {
      const playersInRoom = game.getPlayersInGame();
      io.to(socket.id).emit("receive__players", playersInRoom);
    }
  };

  socket.on("hostGame", hostGame);
  socket.on("fetchQuizList", fetchQuizList);
  socket.on("fetchPlayersInRoom", sendAllPlayersInfoInRoom);
};

export default hostHandle;
