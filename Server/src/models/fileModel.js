const {  DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../config/db.js');
const fileModel = sequelize.define('File',{
    id:{
        type: DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue: UUIDV4
    },
    originalName:{
        type : DataTypes.STRING,
    },
    cloudinaryPublicId:{
        type: DataTypes.STRING,

    },
    cloudinaryUrl:{
        type: DataTypes.STRING,
    },
    shortCode:{
        type: DataTypes.STRING,
        unique:true
    },
    expiresAt:{
        type: DataTypes.DATE,
        allowNull:true
    },
   
    downloadCount:{
        type: DataTypes.INTEGER,
        defaultValue:0
    }
},{
    timestamps:true
});

module.exports = fileModel;