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
    reply_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: false,
    }
}, {timestamps: true});


module.exports = mongoose.model('Message', messageSchema);