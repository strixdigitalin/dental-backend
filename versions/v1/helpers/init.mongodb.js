const mongoose = require("mongoose");
require("dotenv").config();


mongoose.connect(
    'mongodb+srv://anandca:'
    + process.env.MONGO_ATLAS_PW +
    '@d-world-cluster.vced2.mongodb.net/Dworld?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
         useFindAndModify: false 
    }
).then(()=>{console.log('Database Connected')})
.catch(err=>{
    console.log(err.message)
});