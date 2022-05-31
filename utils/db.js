const dbGame = [
  {
    id: "12345",
    questions: [
      {
        id: 1,
        content: "1 + 1 = ?",
        choices: [
          {
            content: "2",
          },
          {
            content: "3",
          },
          {
            content: "0",
          },
          {
            content: "-1",
          },
        ],

        correctAnswer: "2",
      },
    ],
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
