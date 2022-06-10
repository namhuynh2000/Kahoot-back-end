const dbGame = [
  {
    id: "12345",
    questions: [
      {
        id: "1",
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

      {
        id: "2",
        content: "2 + 2 = ?",
        choices: [
          {
            content: "1",
          },
          {
            content: "5",
          },
          {
            content: "4",
          },
          {
            content: "0",
          },
        ],

        correctAnswer: "4",
      },
    ],
    name: "Math",
    createdUserId: "123456",
  },
];

export const getGame = (id) => {
  return dbGame.find((game) => game.id === id);
};

export const getAllQuiz = () => {
  return dbGame;
};

export default dbGame;
