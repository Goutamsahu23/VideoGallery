const mongoose=require('mongoose');
require('dotenv').config();


exports.connect=()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(
        console.log("db connection successfully...")
    ).catch((err)=>{
        console.log(err);
        process.exit(1);
    })
}