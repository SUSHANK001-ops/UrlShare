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

        const uploadedFile = req.files[0];
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

        // schedule deletion (note: use background job/cron in production)
        if (deleteTimeMs > 0) {
            setTimeout(async () => {
                try {
                    await File.destroy({ where: { id: newFile.id } });
                    await cloudinary.uploader.destroy(newFile.cloudinaryPublicId, { resource_type: "auto" });
                } catch (e) {
                    console.error("Scheduled delete failed:", e);
                }
            }, deleteTimeMs);
        }

        res.status(201).json({ shareUrl: `${process.env.BASE_URL}/d/${shortCode}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "upload failed" });
    }
};

module.exports = uploadController;