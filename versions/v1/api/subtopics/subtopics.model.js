const mongoose = require('mongoose');
const subcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title : {type : String},
   topic : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Topics'
   }
    
});
module.exports = mongoose.model('SubTopics', subcategorySchema);