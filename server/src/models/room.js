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
    invite_link: {
        type: String,
        unique: true,
        sparse: true, // allow multiple docs with null invite_link
    }
}, {timestamps: true});

module.exports = mongoose.model('Room', roomSchema);
