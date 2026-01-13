const express = require('express');
const dotenv = require("dotenv");
const { connectDB } = require('./src/config/db');

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send("its home ")
})
app.listen(port,()=>{
    console.log(`Server is running in port : ${port}`)
    connectDB()
    
    
})