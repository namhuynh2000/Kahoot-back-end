import { quizModel } from "../utils/db.js";

export const getGameFromDB = async (id) => {
  const result = await quizModel.findById(id);
  return result;
};

export const getAllQuizFromDB = async () => {
  const result = await quizModel.find({});
  return result;
};
