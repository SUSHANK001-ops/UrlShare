const File = require('../models/fileModel.js');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// Get file info (for API)
const getFileInfo = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ error: "Shortcode is required" })
        }
        const fileRecord = await File.findOne({ where: { shortCode } });
        if (!fileRecord) {
            return res.status(404).json({ error: "File not found" })
        }

        // Return file info without incrementing count
        res.status(200).json({
            id: fileRecord.id,
            originalName: fileRecord.originalName,
            cloudinaryUrl: fileRecord.cloudinaryUrl,
            downloadCount: fileRecord.downloadCount,
            expiresAt: fileRecord.expiresAt,
            shortCode: fileRecord.shortCode,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

// Redirect to client download page
const redirectToDownloadPage = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ error: "Shortcode is required" })
        }

        // Check if file exists
        const fileRecord = await File.findOne({ where: { shortCode } });
        if (!fileRecord) {
            // Redirect to client 404 or home
            return res.redirect(`${process.env.CLIENT_URL || 'https://urlshare.sushanka.com.np'}/?error=not-found`);
        }

        // Redirect to client download page
        res.redirect(`${process.env.CLIENT_URL || 'https://urlshare.sushanka.com.np'}/d/${shortCode}`);
    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.CLIENT_URL || 'https://urlshare.sushanka.com.np'}/?error=server-error`);
    }
}

// Direct download with file streaming
const downloadFile = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ error: "Shortcode is required" })
        }
        
        const fileRecord = await File.findOne({ where: { shortCode } });
        if (!fileRecord) {
            return res.status(404).json({ error: "File not found" })
        }

        // Increment download count
        await fileRecord.increment('downloadCount');

        try {
            // Fetch the file from Cloudinary
            const response = await axios.get(fileRecord.cloudinaryUrl, {
                responseType: 'stream',
                timeout: 30000
            });

            // Set headers for file download
            res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.originalName}"`);
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
            res.setHeader('Content-Length', response.headers['content-length'] || '');

            // Stream the file to client
            response.data.pipe(res);

            response.data.on('error', (error) => {
                console.error('Stream error:', error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Download failed' });
                }
            });
        } catch (fetchError) {
            console.error('Error fetching file from Cloudinary:', fetchError.message);
            // Fallback: redirect to Cloudinary
            res.redirect(fileRecord.cloudinaryUrl);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { getFileInfo, redirectToDownloadPage, downloadFile };