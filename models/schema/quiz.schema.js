import mongoose from "mongoose";
const quizSchema = new mongoose.Schema({
  questions: [
    {
      id: String,
      content: String,
      choices: [
        {
          content: String,
        },
      ],
      correctAnswer: String,
      imgPath: String,
    },
  ],
  name: String,
  userId: String,
  imgPath: String,
});

export const quizModel = mongoose.model("kahoot", quizSchema, "quiz");
