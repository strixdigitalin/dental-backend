const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
