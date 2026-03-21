const UserService = require('../services/user-service');
const userService = new UserService();

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                data: {},
                success: false,
                message: 'Authorization header missing',
                err: {}
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                data: {},
                success: false,
                message: 'Token missing',
                err: {}
            });
        }
        const user = await userService.verifyToken(token);
        if (!user) {
            return res.status(401).json({
                data: {},
                success: false,
                message: 'Invalid token',
                err: {}
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

module.exports = authMiddleware;