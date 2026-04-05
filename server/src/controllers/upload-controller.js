const UploadToCloudinary = require('../utils/uploadToCloudinary'); 
const uploadFile = async (req, res) => {
        try {

        if (!req.file) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'No file uploaded',
                err: {}
            });
        }

        const MAX_SIZE = 10 * 1024 * 1024; 
        if (req.file.size > MAX_SIZE) {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
       

        const fileUrl = await UploadToCloudinary(req.file);
        const isImage = req.file.mimetype.startsWith("image/");

        return res.status(200).json({
            data: { fileUrl: fileUrl, isImage, fileName: req.file.originalname },
            success: true,
            message: 'File uploaded successfully',
            err: {}
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Image upload failed',
            err: error.message || error
        });
    }
};


module.exports = {
    uploadFile
};