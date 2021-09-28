const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testResultSchema = Schema(
  {
    correct_ans : {
        type : Number
    },
    incorrect_ans : {
        type : Number
    },
    unanswered : {
        type : Number
    },
    totalQuestion : {
        type : Number
    },
    score: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestResult", testResultSchema);