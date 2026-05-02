const express = require('express');
const passport = require('passport');
const router = express.Router();
const UserService = require('../../services/user-service');
const userService = new UserService();
const userController = require('../../controllers/user-controller');
const roomController = require('../../controllers/room-controller');
const participantsController = require('../../controllers/participants-controller');
const messageController = require('../../controllers/message-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const upload = require('../../middlewares/upload-middleware');
const uploadController = require('../../controllers/upload-controller');
const downloadController = require('../../controllers/download-controller');
const {FRONTEND_URL} = require('../../config/serverConfig');

router.get('/auth/google', passport.authenticate('google', {session: false, scope: ['profile', 'email']}));
router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    async (req, res) => {
        const token = await userService.generateToken(req.user);
        const redirectUrl = `${FRONTEND_URL}/chat?token=${encodeURIComponent(token)}`;

        res.redirect(redirectUrl);
    }
);

router.post('/signup', userController.signup);
router.post('/login', userController.loginUser);
router.get('/user/:id', userController.getUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/update/user/:id', userController.updateUser);
router.get('/profile', authMiddleware, userController.getUserProfile);

router.post('/privateroom', authMiddleware, roomController.createRoom);
router.post('/group', authMiddleware, roomController.createGroup);
router.get('/room/:id', authMiddleware, roomController.getRoom);
router.delete('/room/:id', authMiddleware, roomController.deleteRoom);
router.post('/dm', authMiddleware, roomController.createDM)


router.post('/participants', authMiddleware, participantsController.createParticipant);
router.get('/participants/rooms/:userid', authMiddleware, participantsController.getAllRoomsById);
router.get('/participants/users/:roomid', authMiddleware, participantsController.getUserInRooms);
router.delete('/participants/:id', authMiddleware, participantsController.deleteParticipant);

router.post('/message', authMiddleware, messageController.createMessage);
router.get('/message/room/:roomid', authMiddleware, messageController.getMessagesByRoomId);
router.delete('/message/:id', authMiddleware, messageController.deleteMessage);

router.post('/invite/:token', authMiddleware, roomController.JoinViaInvite);


router.post('/upload', authMiddleware, upload.single('file'), uploadController.uploadFile);
router.get('/download', authMiddleware, downloadController.downloadFile);



module.exports = router;