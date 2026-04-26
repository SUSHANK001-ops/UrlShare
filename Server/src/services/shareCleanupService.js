const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinary.js');
const { Share, ShareFile } = require('../models/shareModel.js');

let cleanupIntervalId = null;

function getResourceTypeCandidates(resourceType) {
    const normalized = typeof resourceType === 'string' ? resourceType.trim().toLowerCase() : '';
    const ordered = [normalized, 'raw', 'image', 'video'];
    const unique = [];

    for (const item of ordered) {
        if (!item || item === 'auto') continue;
        if (!unique.includes(item)) {
            unique.push(item);
        }
    }

    return unique;
}

async function deleteFromCloudinary(publicId, resourceType) {
    const candidates = getResourceTypeCandidates(resourceType);

    for (const candidate of candidates) {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: candidate,
                type: 'upload',
                invalidate: true,
            });

            if (result?.result === 'ok' || result?.result === 'not found') {
                return true;
            }
        } catch (error) {
            // Try the next resource type fallback.
        }
    }

    throw new Error(`Failed to delete Cloudinary asset: ${publicId}`);
}

async function cleanupShareById(shareId) {
    if (!shareId) return false;

    const share = await Share.findOne({
        where: { id: shareId },
        include: [{ model: ShareFile, as: 'files' }],
    });

    if (!share) {
        return false;
    }

    const files = Array.isArray(share.files) ? share.files : [];
    for (const file of files) {
        try {
            await deleteFromCloudinary(file.cloudinaryPublicId, file.resourceType);
        } catch (error) {
            console.error(`Cloudinary delete failed for ${file.cloudinaryPublicId}:`, error.message);
        }
    }

    await Share.destroy({ where: { id: share.id } });
    return true;
}

async function cleanupExpiredShares(batchLimit = 100) {
    const shares = await Share.findAll({
        where: {
            expiresAt: {
                [Op.lte]: new Date(),
            },
        },
        include: [{ model: ShareFile, as: 'files' }],
        order: [['expiresAt', 'ASC']],
        limit: batchLimit,
    });

    if (shares.length === 0) {
        return 0;
    }

    for (const share of shares) {
        for (const file of share.files || []) {
            try {
                await deleteFromCloudinary(file.cloudinaryPublicId, file.resourceType);
            } catch (error) {
                console.error(`Cloudinary delete failed for ${file.cloudinaryPublicId}:`, error.message);
            }
        }

        await Share.destroy({ where: { id: share.id } });
    }

    return shares.length;
}

function startExpiredShareCleanupJob() {
    if (cleanupIntervalId) {
        return cleanupIntervalId;
    }

    const intervalMs = Number.parseInt(process.env.EXPIRED_CLEANUP_INTERVAL_MS, 10) || 60 * 1000;

    cleanupExpiredShares().catch((error) => {
        console.error('Startup expired cleanup failed:', error.message);
    });

    cleanupIntervalId = setInterval(() => {
        cleanupExpiredShares().catch((error) => {
            console.error('Periodic expired cleanup failed:', error.message);
        });
    }, intervalMs);

    if (typeof cleanupIntervalId.unref === 'function') {
        cleanupIntervalId.unref();
    }

    return cleanupIntervalId;
}

module.exports = {
    cleanupExpiredShares,
    cleanupShareById,
    startExpiredShareCleanupJob,
};
