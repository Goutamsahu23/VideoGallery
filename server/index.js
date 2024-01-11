const express=require('express')
const app=express();
require('dotenv').config();
const cors = require('cors');


const PORT=process.env.PORT || 4000



app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));




const fileupload=require("express-fileupload");

app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));


const db=require('./config/database');
db.connect();

const cloudinary=require('./config/cloudinary');
cloudinary.cloudinaryConnect();


const router=require('./route/routes.js');
app.use('/api/v1',router);

app.get('/',(req,res)=>{
    res.send("<h1>hello</h1>")
})

app.listen(PORT,()=>{
    console.log('app running at ',PORT);
})