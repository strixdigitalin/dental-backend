const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const Schema = mongoose.Schema;

const testSchema = Schema(
  {
    test_name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      enum: ['LEARNING', 'TEST'],
    },
    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User'
    },
    questions_details : [{
     question : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Question'
     },
     isCorrect : Boolean,
     isIncorrect : Boolean,
     isMarked : Boolean,
     isUnanswered : Boolean,
     timeSpend : String
    }],
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
    totalscore: {
      type: Number
    }
  },
  { timestamps: true, ...exportConfig }
);

module.exports = mongoose.model("Test", testSchema);