const router = require('express').Router();
const { getFileInfo, redirectToDownloadPage, downloadFile } = require('../controller/downloadController.js');

// API endpoint for getting file info (doesn't increment counter)
router.get('/download/:shortCode', getFileInfo);

// API endpoint for actual download (increments counter)
router.get('/download/:shortCode/file', downloadFile);

// Redirect to client download page
router.get('/:shortCode', redirectToDownloadPage);

module.exports = router;