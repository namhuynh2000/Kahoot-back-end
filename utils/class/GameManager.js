class GameManager {
  constructor() {
    this.gameList = [];
    this.availableID =
      new Date().getMilliseconds().toString() +
      Math.floor(Math.random() * (999 - 100 + 1) + 100).toString();
  }

  getGame(roomId) {
    return this.gameList.find((game) => {
      return game.room === roomId;
    });
  }

  getGameWithPlayer(playerId) {
    return this.gameList.find((game) => {
      return game.havePlayer(playerId);
    });
  }
  addGame(game) {
    this.gameList.push(game);
  }

  getNextAvailableId() {
    const nextId = +this.availableID + 1;
    this.availableID = nextId.toString();
    return nextId.toString();
  }

  removeGame(game) {
    this.gameList = this.gameList.filter((item) => item.roomId !== game.roomId);
  }
}

const gameManager = new GameManager();
export default gameManager;
