const { create } = require('../models/user');
const ParticipantsService = require('../services/participants-service');
const participantsService = new ParticipantsService();

const createParticipant = async (req, res) => {
    try {
        const data = req.body;
        const participant = await participantsService.create(data);
        return res.status(201).json({
            data: participant,
            success: true,
            message: 'Successfully added a participant to the room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to add a participant to the room',
            err: error
        });
    }
}

const getAllRoomsById = async (req, res) => {
    try {
        const userid = req.params.userid;
        const rooms = await participantsService.getRoomById(userid);
        return res.status(200).json({
            data: rooms,
            success: true,
            message: 'Successfully fetched the rooms',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetched the rooms',
            err: error
        });
    }
}

const getUserInRooms = async (req, res) => {
    try {
        const roomid = req.params.roomid;
        const users = await participantsService.getUserInRooms(roomid);
        if(!users) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'No users found in the room',
                err: {}
            });
        }
        return res.status(200).json({
            data: users,
            success: true,
            message: 'Successfully fetched the users in the room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetched the users in the room',
            err: error
        });
    }
}

const deleteParticipant = async (req, res) => {
    try {
        const id = req.params.id;
        const participant = await participantsService.delete(id);
        return res.status(200).json({
            data: participant,
            success: true,
            message: 'Successfully deleted the participant from the room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to delete the participant from the room',
            err: error
        });
    }
}

module.exports = {
    createParticipant,
    getAllRoomsById,
    getUserInRooms,
    deleteParticipant
}