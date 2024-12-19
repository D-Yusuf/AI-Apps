import { Schema, model } from "mongoose";

const FlashcardsSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  questions: {type: Array, required: true}, // {question: String, answer: String}
  createdAt: {type: Date, default: Date.now},
});

export default model("Flashcards", FlashcardsSchema);