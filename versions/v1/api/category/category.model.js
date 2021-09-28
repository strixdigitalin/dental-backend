const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catSchema = Schema(
  {
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", catSchema);