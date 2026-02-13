const { Share, ShareFile } = require('../models/shareModel.js');
const axios = require('axios');

// Get share info with all files (for API)
const getShareInfo = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ error: "Shortcode is required" });
        }

        const share = await Share.findOne({
            where: { shortCode },
            include: [{
                model: ShareFile,
                as: 'files',
                attributes: ['id', 'originalName', 'fileSize', 'resourceType', 'createdAt']
            }]
        });

        if (!share) {
            return res.status(404).json({ error: "File not found or has expired" });
        }

        // Check if expired
        if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
            return res.status(410).json({ error: "This share has expired" });
        }

        res.status(200).json({
            id: share.id,
            shortCode: share.shortCode,
            downloadCount: share.downloadCount,
            expiresAt: share.expiresAt,
            totalSize: share.totalSize,
            fileCount: share.fileCount,
            files: share.files.map(f => ({
                id: f.id,
                originalName: f.originalName,
                fileSize: Number(f.fileSize),
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Redirect to client download page
const redirectToDownloadPage = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ error: "Shortcode is required" });
        }

        const share = await Share.findOne({ where: { shortCode } });
        if (!share) {
            return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/?error=not-found`);
        }

        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/d/${shortCode}`);
    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/?error=server-error`);
    }
};

// Download a specific file from a share
const downloadFile = async (req, res) => {
    try {
        const { shortCode, fileId } = req.params;
        if (!shortCode || !fileId) {
            return res.status(400).json({ error: "Shortcode and fileId are required" });
        }

        const share = await Share.findOne({ where: { shortCode } });
        if (!share) {
            return res.status(404).json({ error: "Share not found" });
        }

        // Check if expired
        if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
            return res.status(410).json({ error: "This share has expired" });
        }

        const file = await ShareFile.findOne({
            where: { id: fileId, shareId: share.id }
        });

        if (!file) {
            return res.status(404).json({ error: "File not found in this share" });
        }

        // Increment download count on the share
        await share.increment('downloadCount');

        try {
            // Fetch the file from Cloudinary
            const response = await axios.get(file.cloudinaryUrl, {
                responseType: 'stream',
                timeout: 60000
            });

            // Set headers for file download
            const encodedName = encodeURIComponent(file.originalName);
            res.setHeader('Content-Disposition', `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`);
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
            if (response.headers['content-length']) {
                res.setHeader('Content-Length', response.headers['content-length']);
            }

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
            // Fallback: redirect to Cloudinary URL
            res.redirect(file.cloudinaryUrl);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { getShareInfo, redirectToDownloadPage, downloadFile };