const CrudService = require("./crud-service");
const UserRepository = require("../repositories/user-repo");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');

class UserService extends CrudService {
    constructor() {
        const userRepository = new UserRepository();
        super(userRepository);
    }

    async signup(userData) {
        try {
            const existingUser = await this.repository.findOne({ email: userData.email });
            if(existingUser) {
                throw new Error("User with this email already exists");
            }
            const newUser = await this.repository.create(userData);
            const token = await this.generateToken(newUser);
            return { newUser, token };
        } catch (error) {
            console.log("Error signing up user: ", error);
            throw error;
        }
    }

    async login(data) {
        try {
            const user = await this.repository.findOne( { email: data.email  });
            if(!user) {
                console.log("User not found with email: ", data.email);
                throw new Error("User not found")
            }
            if (user.authProvider === "google") {
                throw new Error("Please login using Google");
            }
            const isPasswordValid = await this.verifyPassword(data.password, user.password);
            if(!isPasswordValid) {  
                console.log("Invalid password for user: ", data.email);
                throw new Error("Invalid password");
            }
            const token = await this.generateToken(user);
            return { user, token };
        } catch (error) {
            console.log("Error logging in user: ", error);
            throw error;
        }
    }

    async verifyPassword(plainPassword, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;
        } catch (error) {
            console.log("Error verifying password: ", error);
            throw error;
        }
    }

    async generateToken(user) {
        try {
            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            return token;
        } catch (error) {
            console.log("Error generating token: ", error);
            throw error;
        }
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            console.log("Error verifying token: ", error);
            return false;
        }
    }
}

module.exports = UserService;