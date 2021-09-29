const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = Schema(
  {
    test_name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      enum: ['Learning', 'Test'],
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
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);