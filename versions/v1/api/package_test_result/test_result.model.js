const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const Schema = mongoose.Schema;

const testSchema = Schema(
  {
    test_name: {
      type: String,
      // required: true,
    },
    package: {
      type: String,
      // required: true,
    },

    mode: {
      type: String,
      enum: ["LEARNING", "TEST"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subjects: {
      type: Array,
    },
    subTopics: {
      type: Array,
    },
    topics: {
      type: Array,
    },
    isTestCompleted: { type: Boolean, default: false },
    questions_details: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          // ref: "Question",
          ref: "PackageQuestion",
        },
        isCorrect: Boolean,
        isIncorrect: Boolean,
        isMarked: Boolean,
        isUnanswered: Boolean,
        timeSpend: Number,
      },
    ],
    totalIncorrect: Number,
    totalQuestion: Number,
    totalCorrect: Number,
    totalUnanswered: Number,
    totalTimeSpend: Number,
    totalMarked: Number,
    totalScore: Number,
    endTime: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("packagetest", testSchema);
