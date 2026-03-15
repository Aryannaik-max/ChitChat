const RoomService = require('../services/room-service');
const roomService = new RoomService();


const createRoom = async (req, res) => {
    try {
        const data = req.body;
        const room = await roomService.create(data);
        return res.status(201).json({
            data: room,
            success: true,
            message: 'Successfully created a room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a room',
            err: error
        });
    }
}

const getRoom = async (req, res) => {
    try {
        const id = req.params.id;
        const room = await roomService.findOne(id);
        if(!room) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'Room not found',
                err: {}
            });
        }

        return res.status(200).json({
            data: room,
            success: true,
            message: 'Successfully fetched the room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetch the room',
            err: error
        });
    }
}

const deleteRoom = async (req, res) => {
    try {
        const id = req.params.id;
        const room = await roomService.delete(id);
        if(!room) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'Room not found',
                err: {}
            });
        }

        return res.status(200).json({
            data: room,
            success: true,
            message: 'Successfully deleted the room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to delete the room',
            err: error
        });
    }
}



module.exports = {
    createRoom,
    getRoom,
    deleteRoom,
}
