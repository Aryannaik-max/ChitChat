const express = require('express');
const passport = require('passport');
const router = express.Router();
const UserService = require('../../services/user-service');
const userService = new UserService();

router.get('/auth/google', passport.authenticate('google', {session: false, scope: ['profile', 'email']}));
router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        const token = userService.generateToken(req.user);
        
        res.redirect('http://localhost:5173/chat'); // Redirect to your React app
    }
);


module.exports = router;