const mongoose = require("mongoose");
require("dotenv").config();


mongoose.connect(
    'mongodb+srv://admin:'
    + process.env.MONGO_ATLAS_PW +
    '@dworld.glddb.mongodb.net/dental_world?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).then(() => { console.log('Database Connected') })
    .catch(err => {
        console.log(err.message)
    });