const cloudinary = require("../config/cloudinary.js");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/fileModel.js");

// upload buffer to Cloudinary via stream
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

const uploadController = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: "No file uploaded. Please send a file with any field name.",
            });
        }

        const uploadResults = [];
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

        // Process each file
        for (const uploadedFile of req.files) {
            try {
                const buffer = uploadedFile.buffer;
                const result = await uploadBuffer(buffer);

                // stronger short code
                const shortCode = uuidv4().slice(0, 8);

                // parse deleteTime (ms). Default 10 minutes.
                const deleteTimeMs = Number.parseInt(req.body?.deleteTime, 10) || 10 * 60 * 1000;
                const expiresAt = new Date(Date.now() + deleteTimeMs);

                // create single DB record (store returned instance)
                const newFile = await File.create({
                    originalName: uploadedFile.originalname,
                    cloudinaryPublicId: result.public_id,
                    cloudinaryUrl: result.secure_url,
                    shortCode,
                    downloadCount: 0,
                    expiresAt,
                });

                // Add to results - share URL points to client download page
                uploadResults.push({
                    fileName: uploadedFile.originalname,
                    shareUrl: `${clientUrl}/d/${shortCode}`,
                    fileId: newFile.id
                });

                console.log(`File uploaded successfully: ${uploadedFile.originalname} with code ${shortCode}`);

                // schedule deletion (note: use background job/cron in production)
                if (deleteTimeMs > 0) {
                    setTimeout(async () => {
                        try {
                            await File.destroy({ where: { id: newFile.id } });
                            await cloudinary.uploader.destroy(newFile.cloudinaryPublicId, { resource_type: "auto" });
                            console.log(`File ${shortCode} auto-deleted`);
                        } catch (e) {
                            console.error("Scheduled delete failed:", e);
                        }
                    }, deleteTimeMs);
                }
            } catch (fileError) {
                console.error("Individual file upload failed:", fileError.message);
                uploadResults.push({
                    fileName: uploadedFile.originalname,
                    error: fileError.message || "Failed to upload this file",
                    status: "failed"
                });
            }
        }

        // If at least one file succeeded
        if (uploadResults.some(r => r.shareUrl)) {
            return res.status(201).json({ 
                files: uploadResults,
                message: `Successfully uploaded ${uploadResults.filter(r => r.shareUrl).length} of ${req.files.length} file(s)`
            });
        } else {
            return res.status(500).json({ 
                error: "Failed to upload files",
                files: uploadResults
            });
        }
    } catch (err) {
        console.error("Upload controller error:", err);
        res.status(500).json({ error: "upload failed: " + err.message });
    }
};

module.exports = uploadController;