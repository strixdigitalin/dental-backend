const mongoose = require("mongoose");
const exportConfig = require("../../configs/exportConfig");
const subcategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topics",
    },
  },
  exportConfig
);
module.exports = mongoose.model("SubTopics", subcategorySchema);
