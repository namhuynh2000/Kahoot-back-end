class Game {
  constructor(roomId, hostID, data) {
    this.roomId = roomId || "";
    this.playerList = [];
    this.host = hostID || "";
    this.start = false;
    this.data = data;
    this.answers = this.data.questions.map((ques) => {
      const id = ques.id;
      return { id, playerAnswers: [] };
    });
  }

  getPlayer(playerId)
  {
    return this.playerList.find(player=>player.id === playerId);
  }
  getQuestion(id) {
    console.log(id);
    return this.data.questions.find(ques=>ques.id === id);
  }

  getAnswer(id)
  {
    return this.answers.find(ans => ans.id === id);
  }

  addPlayerToGame(player) {
    this.playerList.push(player);
  }

  getPlayersInGame() {
    return this.playerList;
  }

  removePlayer(id) {
    this.playerList = this.playerList.filter((player) => player.id !== id);
  }

  havePlayer(id) {
    return this.playerList.find((player) => player.id === id);
  }

  getHost() {
    return this.host;
  }

  startGame() {
    this.start = true;
    return this.start;
  }

  updatePlayerAnswer(playerId, questionId, answer) {
    const question = this.data.questions.find((ques) => ques.id === questionId);

    if (question) {
      const questionAnswer = this.answers.find((ans) => ans.id === questionId);
      console.log("player:", answer);
      console.log("correct:", question.correctAnswer);
      if (question.correctAnswer === answer) {
        const index = questionAnswer.playerAnswers.length;
        const newScore = 1000 - index * 20;

        //  Update number of player has answer the question
        this.answers.forEach((ans) => {
          ans.playerAnswers.push({ player: playerId, answer });
        });

        //  Update player score
        this.playerList.forEach((player) => {
          if (player.id === playerId) {
            console.log(newScore);
            player.score += newScore;
          }
        });
      }
      return this.answers;
    }
  }
}

export default Game;
