const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = require('./serverConfig')
const UserService = require('../services/user-service');
const userService = new UserService();

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/api/v1/auth/google/callback",
    },
    async (accesToken, refreshToken, profile, done) => {
        console.log('Google profile: ', profile);
        try {
            const user = await userService.findOne({ googleId: profile.id });
            if(!user) {
                console.log("signing up new user with google id: ", profile.id);
                const newUser = await userService.signup({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    authProvider: 'google',
                });
                return done(null, newUser);
            } else {
                console.log("User already exists with google id: ", profile.id);
                return done(null, user);
            }
        } catch (error) {
            console.log("Error in Google Oauth callback: ", error);
            done(error, null);
        }
    }

));

passport.serializeUser((user, done) => {
    try {
        done(null, user._id);
    } catch (error) {
        done(error, null);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userService.findOne({ _id: id });
        done(null, user);
    } catch (error) {
        console.log("Error deserializing user: ", error);
        done(error, null);
    }
})

module.exports = passport;