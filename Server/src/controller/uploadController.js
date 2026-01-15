const cloudinary = require("../config/cloudinary.js");
const { v4: uuidv4 } = require("uuid"); // you’ll need this in the next bullet
const File = require("../models/fileModel.js"); // your Sequelize model

// helper you already wrote
function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// main controller
const uploadController = async (req, res) => {
  try {
    // Check if any files are present
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: "No file uploaded. Please send a file with any field name." 
      });
    }
    
    // Get the first uploaded file
    const uploadedFile = req.files[0];
    const buffer = uploadedFile.buffer;
    const result = await uploadBuffer(buffer); // bullets 2-3
    const shortCode = Math.random().toString(36).slice(-6); // quick random
    const newFile = await File.create({
      originalName: uploadedFile.originalname,
      cloudinaryPublicId: result.public_id,
      cloudinaryUrl: result.secure_url,
      shortCode,
      downloadCount: 0,
    });
    res
      .status(201)
      .json({ shareUrl: `${process.env.BASE_URL}/d/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload failed" });
  }
};

module.exports = uploadController;
