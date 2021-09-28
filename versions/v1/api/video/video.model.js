const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
