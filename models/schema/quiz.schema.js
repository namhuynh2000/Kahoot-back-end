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
    },
  ],
  name: String,
  createdUserId: String,
});

export const quizModel = mongoose.model("kahoot", quizSchema, "quiz");
