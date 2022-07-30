const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const Schema = mongoose.Schema;

const SubjectSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questionCount: {
      type: Number,
    },
    user: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        isCorrect: {
          type: Boolean,
        },
        isIncorrect: {
          type: Boolean,
        },
        isUnanswered: {
          type: Boolean,
        },
        isMarked: {
          type: Boolean,
        },
      },
    ],
  },
  { ...exportConfig, timestamps: true }
);

module.exports = mongoose.model("Package", SubjectSchema);
