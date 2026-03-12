const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    message_sent: {
        type: Date,
        default: Date.now,  
    },
}, {timestamps: true});


module.exports = mongoose.model('Message', messageSchema);