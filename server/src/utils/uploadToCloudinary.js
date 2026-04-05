const cloudinary = require('../config/cloudinaryConfig');

const sanitizeBaseName = (value) => {
    if (!value) return 'file';
    return value
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '') || 'file';
};

const UploadToCloudinary = async (file) => {
    const originalName = file?.originalname || 'file';
    const isImage = file?.mimetype?.startsWith('image/');
    const baseName = sanitizeBaseName(originalName);
    const timestamp = Date.now();
    const publicId = `${timestamp}-${baseName}`;

    const uploadOptions = {
        resource_type: isImage ? 'image' : 'raw', 
        type: 'upload',
        public_id: publicId,
        access_mode: 'public',
        overwrite: false,
    };
    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url); 
                }
            }
        );
        uploadStream.end(file.buffer);
    });
};

module.exports = UploadToCloudinary;