const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const { connectDB } = require('./src/config/db');
const uploadRoute = require('./src/routes/uploadRoute.js');
const { getShareInfo, downloadFile, redirectToDownloadPage } = require('./src/controller/downloadController.js');
const { startExpiredShareCleanupJob } = require('./src/services/shareCleanupService.js');
dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://urlshare.sushanka.com.np',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ['Content-Type', 'x-share-password'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("URL Share API Server - Running on port " + port)
})

// Upload route
app.use('/api', uploadRoute);

// API: Get share info (all files in a share)
app.get('/api/download/:shortCode', getShareInfo);

// API: Download a specific file from a share
app.get('/api/download/:shortCode/file/:fileId', downloadFile);

// Redirect: /d/:shortCode -> client download page
app.get('/d/:shortCode', redirectToDownloadPage);

app.listen(port, async () => {
    console.log(`Server is running in port : ${port}`)
  await connectDB()
  startExpiredShareCleanupJob()
})