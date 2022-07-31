const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const Schema = mongoose.Schema;

const questionSchema = Schema(
  {
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    // topic: { type: Schema.Types.ObjectId, ref: "Topics" },
    // subtopic: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "SubTopics",
    // },
    questionTitle: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    options: [
      {
        option: String,
        isCorrect: Boolean,
      },
    ],
    explaination: {
      type: String,
    },
  },
  { timestamps: true, ...exportConfig }
);

module.exports = mongoose.model("PackageQuestion", questionSchema);
