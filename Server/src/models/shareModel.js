const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../config/db.js');

// A Share groups one or more files under a single shortCode
const Share = sequelize.define('Share', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    shortCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    downloadCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalSize: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    fileCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

// Each file belongs to a Share
const ShareFile = sequelize.define('ShareFile', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    shareId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Share,
            key: 'id'
        }
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cloudinaryPublicId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cloudinaryUrl: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    fileSize: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    resourceType: {
        type: DataTypes.STRING,
        defaultValue: 'auto'
    }
}, {
    timestamps: true
});

// Associations
Share.hasMany(ShareFile, { foreignKey: 'shareId', as: 'files', onDelete: 'CASCADE' });
ShareFile.belongsTo(Share, { foreignKey: 'shareId', as: 'share' });

module.exports = { Share, ShareFile };
