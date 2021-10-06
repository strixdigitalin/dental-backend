const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type : String,
    default : "User"
  },
  area_of_practise: {
    type: String,
    required: true,
  },
  resetLinkToken: {
    type: String,
    default: ''
  }
},{timestamps: true});

module.exports = mongoose.model("User", userSchema);
