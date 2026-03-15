const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },  
    last_seen_message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, {timestamps: true});

    
module.exports = mongoose.model('Participant', participantSchema);