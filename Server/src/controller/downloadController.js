const File = require('../models/fileModel.js');
const cloudinary = require('cloudinary').v2;

const downloadController = async(req,res)=>{
    try {
        const {shortCode} = req.params;
        if(!shortCode){
            return res.status(400).json({error:"Shortcode is required"})
        }
        const fileRecord = await File.findOne({where:{shortCode}});
        if(!fileRecord){
            return res.status(404).json({error:"File not found"})
        }
        
        // Increment download count
        await fileRecord.increment('downloadCount');
        
        // Redirect to the Cloudinary URL
        res.redirect(fileRecord.cloudinaryUrl);     

    } catch (error) {
        res.status(500).json({error:"Server error"});
    }
}
module.exports = downloadController;