const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    zipcode: { type: Number, default: 000000 },
    phone: { type: Number, required:true },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    expiryDate: {
        type: Date
    }
});

module.exports = mongoose.model("Profile", profileSchema);
