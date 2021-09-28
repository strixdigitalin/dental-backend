const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = Schema(
  {
   name : {
       type : String,
       required : true
   },
   extensionDays : {
       type : Number,
       required : true
   },
   amount : {
       type : Number,
       required : true
   },
   renewalDays : {
       type : Number,
       required : true
   },
   description : [
       {
           title : {
            type : String,
            required : true
        }
       }
   ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);