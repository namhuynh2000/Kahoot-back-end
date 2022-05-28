class Game {
  constructor(id, hostID) {
    this.id = id || "";
    this.playerList = [];
    this.host = hostID || "";
    this.start = false;
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

  removeAllPlayer() {
    this.playerList;
  }

  getNextAvailableId() {
    return +this.id + 1;
  }

  getHost() {
    return this.host;
  }
}

export default Game;
