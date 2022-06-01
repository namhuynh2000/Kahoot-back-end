import { getAllQuizFromDB, getGameFromDB } from "../../models/server.model.js";
import Game from "../../utils/class/game.js";
import gameManager from "../../utils/class/GameManager.js";

const hostHandle = (io, socket) => {
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
      const newGame = new Game(room, socket.id, id, game.name);

      socket.join(room);
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

  const startGame = (room) => {
    const game = gameManager.getGame(room);
    if (game) {
      //Starting game

      //Notify for all player that the host is starting the game
      io.to(room).emit("hostStartingGame");

      //Count down starting event for host
      let counting = 3;
      const interval = setInterval(() => {
        if (counting === 0) {
          game.startGame();

          // Notify all player and the host if start success
          io.to(room).emit("startGameRes", { result: true });
          clearInterval(interval);
        }
        io.to(socket.id).emit("startGameCountDown", counting--);
      }, 1000);

      return;
    }

    //Notify  all player and the host if start failed
    io.to(room).emit("startGameRes", { result: false });
    io.to(socket.id).emit("startGameRes", { result: false });
  };
  socket.on("hostGame", hostGame);
  socket.on("fetchQuizList", fetchQuizList);
  socket.on("fetchPlayersInRoom", sendAllPlayersInfoInRoom);
  socket.on("startGame", startGame);
};

export default hostHandle;
