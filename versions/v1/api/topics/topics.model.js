const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const topicsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    questionCount: {
      type: Number,
    },
  },
  exportConfig
);
module.exports = mongoose.model("Topics", topicsSchema);
