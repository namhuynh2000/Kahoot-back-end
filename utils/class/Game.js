class Game {
  constructor(roomId, hostID, quizId,gameName) {
    this.roomId = roomId || "";
    this.playerList = [];
    this.host = hostID || "";
    this.start = false;
    this.quizId = quizId || "";
     this.name = gameName || "";
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

  // removeAllPlayer() {
  //   this.playerList;
  // }
  //
  // getNextAvailableId() {
  //   return +this.id + 1;
  // }

  getHost() {
    return this.host;
  }

  startGame(){
    this.start = true;
    return this.start;
  }

}

export default Game;
