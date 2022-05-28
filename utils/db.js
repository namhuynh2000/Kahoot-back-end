const dbGame = [
  {
    id: "12345",
    questions: [],
    name: "Math",
  },
];

export const getGame = (id) => {
  return dbGame.find((game) => game.id === id);
};

export const getAllQuiz = () => {
  return dbGame;
};

export default dbGame;
