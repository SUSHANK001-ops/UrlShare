const router = require('express').Router();
const { getShareInfo, redirectToDownloadPage, downloadFile } = require('../controller/downloadController.js');

// API endpoint for getting share info with all files
router.get('/download/:shortCode', getShareInfo);

// API endpoint for downloading a specific file from a share
router.get('/download/:shortCode/file/:fileId', downloadFile);

// Redirect to client download page
router.get('/:shortCode', redirectToDownloadPage);

module.exports = router;