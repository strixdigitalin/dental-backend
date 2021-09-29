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
    explaination : {
      type : String
    },
    user : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
