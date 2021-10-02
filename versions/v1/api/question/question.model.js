const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = Schema(
  {
    subject : {type : Schema.Types.ObjectId, ref: "Subject"},
    topic: {type: Schema.Types.ObjectId, ref: "Topics"},
    subtopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTopics"
    },
    questionTitle: {
      type: String,
      required: true,
    },
    questionType : {
      type : String,
      enum : ['Easy','Medium','Hard'],
      required : true
    },
    options: [
      {
        option: String,
        isCorrect: Boolean,
      },
    ],
    explaination : {
      type : String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
