class GameManager {
  constructor() {
    this.gameList = [];
    this.availableID =
      new Date().getMilliseconds().toString() +
      Math.floor(Math.random() * (999 - 100 + 1) + 100).toString();
  }

  getGame(roomId) {
    return this.gameList.find((game) => {
      return game.roomId === roomId;
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
    this.gameList = this.gameList.filter((item) => item.id !== game.id);
  }
}

export default GameManager;
