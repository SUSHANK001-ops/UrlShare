const express = require('express');
const dotenv = require("dotenv");
const { connectDB } = require('./src/config/db');
const uploadRoute = require('./src/routes/uploadRoute.js');
const downloadRoute = require('./src/routes/downloadRouter.js');
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send("its home ")
})
app.use(express.json())
app.use('/api',uploadRoute )
app.use('/d',downloadRoute )
app.listen(port,()=>{
    console.log(`Server is running in port : ${port}`)
    connectDB()
    
    
})