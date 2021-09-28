const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    topics: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topics'
    }],
    questionsCount: {
      type: Number,
      default : 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FunctionalKnowledge", categorySchema);
