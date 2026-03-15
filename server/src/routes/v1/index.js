const express = require('express');
const passport = require('passport');
const router = express.Router();
const UserService = require('../../services/user-service');
const userService = new UserService();
const userController = require('../../controllers/user-controller');
const roomController = require('../../controllers/room-controller');
const participantsController = require('../../controllers/participants-controller');
const messageController = require('../../controllers/message-controller');

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

router.post('/room', roomController.createRoom);
router.get('/room/:id', roomController.getRoom);
router.delete('/room/:id', roomController.deleteRoom);

router.post('/participants', participantsController.createParticipant);
router.get('/participants/rooms/:userid', participantsController.getAllRoomsById);
router.get('/participants/users/:roomid', participantsController.getUserInRooms);
router.delete('/participants/:id', participantsController.deleteParticipant);

router.post('/message', messageController.createMessage);
router.get('/message/room/:roomid', messageController.getMessagesByRoomId);
router.delete('/message/:id', messageController.deleteMessage);



module.exports = router;