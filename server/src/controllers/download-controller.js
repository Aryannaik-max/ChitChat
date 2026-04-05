const axios = require('axios');

const sanitizeFileName = (value) => {
    if (!value || typeof value !== 'string') return 'file';

    return value
        .replace(/[\\/:*?"<>|]/g, '_')
        .trim() || 'file';
};

const downloadFile = async (req, res) => {
    try {
        const { url, fileName } = req.query;

        if (!url) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'File URL is required',
                err: {}
            });
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch (error) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'Invalid file URL',
                err: {}
            });
        }

        const isCloudinaryHost = parsedUrl.hostname === 'res.cloudinary.com' || parsedUrl.hostname.endsWith('.cloudinary.com');
        if (!isCloudinaryHost) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'Unsupported file host',
                err: {}
            });
        }

        const upstream = await axios.get(parsedUrl.toString(), {
            responseType: 'stream',
            timeout: 30000
        });

        const safeName = sanitizeFileName(fileName);
        const contentType = upstream.headers['content-type'] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`);

        upstream.data.pipe(res);
    } catch (error) {
        console.error('Download proxy error:', error?.message || error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to download file',
            err: error?.message || error
        });
    }
};

module.exports = {
    downloadFile
};
