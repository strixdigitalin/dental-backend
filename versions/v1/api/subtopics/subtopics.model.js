const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const subcategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topics",
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
module.exports = mongoose.model("SubTopics", subcategorySchema);
