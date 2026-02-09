const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const { connectDB } = require('./src/config/db');
const uploadRoute = require('./src/routes/uploadRoute.js');
const downloadRoute = require('./src/routes/downloadRouter.js');
const { getFileInfo } = require('./src/controller/downloadController.js');
dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("URL Share API Server - Running on port " + port)
})

app.use('/api', uploadRoute);
app.get('/api/download/:shortCode', getFileInfo);  // API endpoint for file info
app.use('/d', downloadRoute);  // Redirect to client download page

app.listen(port,()=>{
    console.log(`Server is running in port : ${port}`)
    connectDB()
})