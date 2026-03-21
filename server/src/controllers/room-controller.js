const RoomService = require('../services/room-service');
const Participant = require('../models/participants'); 
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

const JoinViaInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;

    // 🔍 find room by invite token
    const room = await roomService.findOne({ invite_link: token });

    if (!room) {
      return res.status(404).json({ message: "Invalid invite link" });
    }

    // ✅ check if already joined
    const existing = await Participant.findOne({
      user_id: userId,
      room_id: room._id
    });

    if (!existing) {
      await Participant.create({
        user_id: userId,
        room_id: room._id
      });
    }

    return res.status(200).json({
      data: room,
      success: true,
      message: "Joined successfully",
      err: {}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const createGroup = async (req, res) => {
    try {
        const { room_name, admin_id } = req.body;
        if(!room_name || !admin_id) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'room_name and admin_id are required to create a group',
                err: {}
            });
        }
        const group = await roomService.createGroup(room_name, admin_id);
        if(!group) {
            return res.status(400).json({
                data: {},
                success: false,
                message: 'Not able to create a group',
                err: {}
            });
        }
        return res.status(201).json({
            data: group,
            success: true,
            message: 'Successfully created a group',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a group',
            err: error
        });
    }
}

const createDM = async (req, res) => {
    try {
        const response = await roomService.createDM(req.body.userId1, req.body.userId2);
        if(!response) {
            return res.status(400).json({
                data: {},
                success: false,
                message: "Not able to create DM",
                err: {}
            });
        }
        return res.status(201).json({
            data: response,
            success: true,
            message: "DM created successfully",
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Not able to create DM",
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
    createGroup,
    JoinViaInvite,
    createDM
}
