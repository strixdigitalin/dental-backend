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
    test_results: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestResult'
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    totalscore: {
      type: Number
    },
    totalQuestions : {
      type : Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
