import dbGame, { getGame, getAllQuiz } from "../utils/db.js";

export const getGameFromDB = (id) => {
  return getGame(id);
};

export const getAllQuizFromDB = () => {
  return getAllQuiz();
};
