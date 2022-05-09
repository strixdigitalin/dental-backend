const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
  customer_id: {
    type: String,
  },
  amount: {
    type: Number,
  },
});

module.exports = mongoose.model("Payment", Schema);
