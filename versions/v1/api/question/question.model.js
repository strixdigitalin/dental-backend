const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = Schema(
  {
    functionalKnowledge: { type: Schema.Types.ObjectId, ref: "FunctionalKnowledge" },
    topics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topics'
    },
    questionTitle: {
      type: String,
      required: true,
    },
    options: [
      {
        option: String,
        isCorrect: Boolean,
      },
    ],
    users : [
      {
        user : {type : mongoose.Schema.Types.ObjectId,ref : 'User'},
        isUnused : {type : Boolean ,default : false},
        isMarked : {type : Boolean,default : false},
        isIncorrect : {type : Boolean,default : false},
        isCorrect : {type : Boolean,default : false}
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
