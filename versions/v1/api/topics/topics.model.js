const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const topicsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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
  exportConfig
);
module.exports = mongoose.model("Topics", topicsSchema);
