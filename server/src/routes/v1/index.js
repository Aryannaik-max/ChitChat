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

router.get('/auth/google', passport.authenticate('google', {session: false, scope: ['profile', 'email']}));
router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        // Successful authentication, redirect to frontend
        const token = await userService.generateToken(req.user);
        
        res.redirect('http://localhost:5173/chat'); // Redirect to your React app
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



module.exports = router;