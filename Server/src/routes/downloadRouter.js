const router = require('express').Router();
const { redirectToDownloadPage, downloadFile } = require('../controller/downloadController.js');

// API endpoint for actual download (increments counter)
router.get('/download/:shortCode', downloadFile);

// Redirect to client download page
router.get('/:shortCode', redirectToDownloadPage);

module.exports = router;