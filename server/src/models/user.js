const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        required: true,
        default: 'local'
    },
}, {timestamps: true});

userSchema.pre('save', async function () {

    if(!this.isModified('password')) {
        return;
    }

    if(this.authProvider === 'local') {

        if(!this.password) {
            throw new Error("Password is required for local authentication");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);

        this.password = hashedPassword;
    }
});


module.exports = mongoose.model('User', userSchema);