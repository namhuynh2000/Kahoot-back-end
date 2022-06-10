import { getAllQuizFromDB, getGameFromDB } from "../../models/server.model.js";
import Game from "../../utils/class/game.js";
import gameManager from "../../utils/class/GameManager.js";

const hostHandle = (io, socket) => {
  const fetchQuizList = async () => {
    const list = getAllQuizFromDB();
    io.to(socket.id).emit("fetchQuizListRes", list);
  };

  const createGame = () => {};

  // Host game
  const hostGame = (id) => {
    // Load game from database
    const game = getGameFromDB(id);

    if (game) {
      const room = gameManager.getNextAvailableId();
      const newGame = new Game(room, socket.id, game);

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

  // Start game
  const startGame = (room) => {
    const game = gameManager.getGame(room);
    if (game) {
      //Starting game

      //Notify for all player that the host is starting the game
      io.to(room).emit("hostStartingGame");

      //Count down starting event for host
      // let counting = 3;
      // const interval = setInterval(() => {
      //   if (counting === 0) {
      //     game.startGame();

      //     // Notify all player and the host if start success
      //     io.to(room).emit("startGameRes", { result: true });
      //     clearInterval(interval);
      //   }
      //   io.to(socket.id).emit("startGameCountDown", counting--);
      // }, 1000);

      return;
    }

    //Notify  all player and the host if start failed
    // io.to(room).emit("startGameRes", { result: false });
    io.to(socket.id).emit("startGameRes", { result: false });
  };

  // Get question
  const getQuestion = (room, startTime) => {
    const game = gameManager.getGame(room);

    console.log("game:", game);
    if (game) {
      const questionData = game.getQuestion();

      if (questionData) {
        io.to(socket.id).emit("getQuestionRes", { questionData, result: true });

        setTimeout(() => {
          io.to(room).emit("hostGetQuestionRes", {
            questionData,
            result: true,
          });
        }, startTime * 1000);
      } else {
        // Notify all player and the host if get question failed
        io.to(room).emit("getQuestionRes", { result: false });
        io.to(socket.id).emit("getQuestionRes", { result: false });
      }
      return;
    }
    // Notify all player and the host if get question failed
    // io.to(room).emit("getQuestionRes", { result: false });
    io.to(socket.id).emit("getQuestionRes", { result: false });
  };

  const stopQuestion = (room) => {
    const game = gameManager.getGame(room);
    if (game) {
      io.to(room).emit("questionTimeOut");
    }
  };

  const nextQuestion = (room) => {
    const game = gameManager.getGame(room);

    if (game) {
      game.increaseQuestionIndex();

      if (game.currentQuestionIndex >= game.data.questions.length) {
        io.to(room).emit("nextQuestionRes", { result: false });
        return;
      }
      io.to(room).emit("nextQuestionRes", { result: true });
    }
  };

  const getRankList = (room) => {
    const game = gameManager.getGame(room);

    if (game) {
      const rankList = game.getPlayersInGame().slice(0, 10);

      io.to(room).emit("getRankListRes", { result: true, rankList });
      return;
    }
    io.to(room).emit("getRankListRes", { result: false });
    io.to(socket.id).emit("getRankListRes", { result: false });
  };

  const getSummaryRankList = (room, loadingTime) => {
    const game = gameManager.getGame(room);

    console.log(loadingTime);
    if (game) {
      const rankList = game.getPlayersInGame();

      io.to(socket.id).emit("getSummaryRankListRes", rankList);

      setTimeout(() => {
        io.to(room).emit("playerRank", rankList);
      }, loadingTime * 1000);
    }
  };

  socket.on("hostGame", hostGame);
  socket.on("fetchQuizList", fetchQuizList);
  socket.on("fetchPlayersInRoom", sendAllPlayersInfoInRoom);
  socket.on("startGame", startGame);
  socket.on("getQuestion", getQuestion);
  socket.on("stopQuestion", stopQuestion);
  socket.on("nextQuestion", nextQuestion);
  socket.on("getRankList", getRankList);
  socket.on("getSummaryRankList", getSummaryRankList);
};

export default hostHandle;
