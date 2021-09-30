const mongoose = require('mongoose');
const topicsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title : {type : String,required: true},
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      }
});
module.exports = mongoose.model('Topics', topicsSchema);