const mongoose = require('mongoose');
const subcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title : {type : String},
    questionsCount : {type : Number,default : 0}
    
});
module.exports = mongoose.model('SubTopics', subcategorySchema);