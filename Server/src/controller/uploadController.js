const cloudinary = require("../config/cloudinary.js");
const crypto = require('crypto');
const { v4: uuidv4 } = require("uuid");
const { Share, ShareFile } = require("../models/shareModel.js");

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total per share

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derivedKey}`;
}

// upload buffer to Cloudinary via stream
function uploadBuffer(buffer, originalName) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                // Use raw for non-image/non-video files to preserve format
                ...(isRawFile(originalName) ? { resource_type: "raw" } : {}),
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

// Check if a file should be uploaded as "raw" (binary) to Cloudinary
function isRawFile(filename) {
    const ext = (filename || '').split('.').pop().toLowerCase();
    const rawExtensions = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'txt', 'csv', 'json', 'xml', 'zip', 'rar', '7z', 'tar', 'gz',
        'exe', 'msi', 'dmg', 'apk', 'ipa',
        'html', 'css', 'js', 'ts', 'py', 'java', 'cpp', 'c', 'h',
        'md', 'rtf', 'odt', 'ods', 'odp',
        'ttf', 'otf', 'woff', 'woff2',
        'sql', 'db', 'sqlite',
        'iso', 'img', 'bin',
        'psd', 'ai', 'sketch', 'fig',
        'epub', 'mobi',
    ];
    return rawExtensions.includes(ext);
}

const uploadController = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: "No file uploaded. Please send a file with any field name.",
            });
        }

        // Check total size
        let totalSize = 0;
        for (const file of req.files) {
            totalSize += file.size;
        }
        if (totalSize > MAX_TOTAL_SIZE) {
            return res.status(400).json({
                error: `Total file size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds 100MB limit.`,
            });
        }

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

        // Generate ONE shortCode for the entire share
        const shortCode = uuidv4().slice(0, 8);

        // Parse deleteTime (ms). Default 10 minutes.
        const deleteTimeMs = Number.parseInt(req.body?.deleteTime, 10) || 10 * 60 * 1000;
        const expiresAt = new Date(Date.now() + deleteTimeMs);
        const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
        const passwordHash = password ? hashPassword(password) : null;

        // Create the Share record first
        const share = await Share.create({
            shortCode,
            expiresAt,
            downloadCount: 0,
            totalSize,
            fileCount: req.files.length,
            passwordHash,
        });

        const uploadedFiles = [];
        const failedFiles = [];

        // Upload each file to Cloudinary and create ShareFile records
        for (const uploadedFile of req.files) {
            try {
                const buffer = uploadedFile.buffer;
                const result = await uploadBuffer(buffer, uploadedFile.originalname);

                await ShareFile.create({
                    shareId: share.id,
                    originalName: uploadedFile.originalname,
                    cloudinaryPublicId: result.public_id,
                    cloudinaryUrl: result.secure_url,
                    fileSize: uploadedFile.size,
                    resourceType: result.resource_type || 'auto',
                });

                uploadedFiles.push({
                    fileName: uploadedFile.originalname,
                    size: uploadedFile.size,
                });

                console.log(`File uploaded: ${uploadedFile.originalname} -> share ${shortCode}`);
            } catch (fileError) {
                console.error("Individual file upload failed:", fileError.message);
                failedFiles.push({
                    fileName: uploadedFile.originalname,
                    error: fileError.message || "Failed to upload this file",
                });
            }
        }

        // If no files succeeded, clean up the share
        if (uploadedFiles.length === 0) {
            await Share.destroy({ where: { id: share.id } });
            return res.status(500).json({
                error: "Failed to upload all files",
                failedFiles,
            });
        }

        // Update file count if some failed
        if (failedFiles.length > 0) {
            await share.update({ fileCount: uploadedFiles.length });
        }

        // Schedule deletion
        if (deleteTimeMs > 0) {
            setTimeout(async () => {
                try {
                    // Get all files in this share
                    const files = await ShareFile.findAll({ where: { shareId: share.id } });
                    // Delete from Cloudinary
                    for (const file of files) {
                        await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
                            resource_type: file.resourceType || "auto"
                        }).catch(e => console.error("Cloudinary delete failed:", e));
                    }
                    // Delete DB records (cascade will remove ShareFiles)
                    await Share.destroy({ where: { id: share.id } });
                    console.log(`Share ${shortCode} auto-deleted (${files.length} files)`);
                } catch (e) {
                    console.error("Scheduled delete failed:", e);
                }
            }, deleteTimeMs);
        }

        const shareUrl = `${clientUrl}/d/${shortCode}`;

        return res.status(201).json({
            shareUrl,
            shortCode,
            fileCount: uploadedFiles.length,
            totalSize,
            uploadedFiles,
            failedFiles,
            expiresAt,
            passwordProtected: Boolean(passwordHash),
            message: `Successfully uploaded ${uploadedFiles.length} file(s). Share URL: ${shareUrl}`,
        });
    } catch (err) {
        console.error("Upload controller error:", err);
        res.status(500).json({ error: "Upload failed: " + err.message });
    }
};

module.exports = uploadController;