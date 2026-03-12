const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_name: {
        type: String,
        required: true,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    is_group: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model('Room', roomSchema);
