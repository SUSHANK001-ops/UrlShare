const router = require('express').Router();
const uploadController = require('../controller/uploadController.js');
const uploadMulter = require('../middleware/uploadMulter.js');

// Error handling middleware for multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 10MB.' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Too many files. Please send only one file.' 
      });
    }
    if (err.message === 'Field name missing') {
      return res.status(400).json({ 
        error: 'Field name missing. Please send a file with any field name.' 
      });
    }
    return res.status(400).json({ 
      error: 'Upload error: ' + err.message 
    });
  }
  next();
};

router.post('/upload', uploadMulter, handleMulterErrors, uploadController);

module.exports = router;