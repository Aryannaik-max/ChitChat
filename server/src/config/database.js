const mongoose = require('mongoose');
const {MONGODB_URL} = require('./serverConfig');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URL);
        console.log('SUCCESS! Connected to MongoDB Atlas');
        console.log(`Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDB;