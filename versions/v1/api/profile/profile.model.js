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
    },
    question_details : [
        {
          question : {type : mongoose.Schema.Types.ObjectId,ref : 'Question'},
          isUnanswered : {type : Boolean ,default : false},
          isMarked : {type : Boolean,default : false},
          isIncorrect : {type : Boolean,default : false},
          isCorrect : {type : Boolean,default : false}
        }
      ],
      total_Correct : {
        type : Number,
        default : 0
      },
      total_Unused : {
          type : Number
      },
      total_questions : {
          type : Number
      },
      total_Incorrect : {
          type : Number,
          default : 0
      },
      total_Marked : {
          type : Number,
          default : 0
      },
      total_Unanswered : {
          type : Number,
          default : 0
      }
});

module.exports = mongoose.model("Profile", profileSchema);
