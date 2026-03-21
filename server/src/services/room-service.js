const CrudService = require('./crud-service');
const RoomRepository = require('../repositories/room-repo');
const ParticipantRepository = require('../repositories/participants-repo');
const participantsRepo = new ParticipantRepository();
const Participant = require('../models/participants');
const crypto = require('crypto');
class RoomService extends CrudService {
    constructor() {
        const roomRepository = new RoomRepository();
        super(roomRepository);
    }
    async createGroup(room_name, creatorId) {
        try {
            const invite_link = crypto.randomBytes(16).toString('hex');
            console.log("invite_link",invite_link)
            const newRoom = await this.repository.create({ room_name, admin_id: creatorId, is_group: true, invite_link });
            if(creatorId) {
                await participantsRepo.create({ room_id: newRoom._id, user_id: creatorId });
            }
            console.log("Group created successfully: ", newRoom);
            return newRoom;
        } catch (error) {
            console.log("Error creating group: ", error);
            throw error;
        }
    }

    async createDM(userId1, userId2) {
        try {
            const user1Rooms = await Participant.find({ user_id: userId1 }).populate('room_id');
            const user2Rooms = await Participant.find({ user_id: userId2 }).populate('room_id');

            if(user1Rooms && user2Rooms) {
                const existingDM = user1Rooms.find(p1 => user2Rooms.some(p2 => p1.room_id._id.toString() === p2.room_id._id.toString() && !p1.room_id.is_group));

                if(existingDM) {
                    console.log("DM already exists between users", userId1, userId2, existingDM.room_id);
                    return existingDM.room_id;
                }
                const room_name = `DM: ${userId1} & ${userId2}`;
                const newRoom = await this.repository.create({ room_name, is_group: false });
                await participantsRepo.create({ room_id: newRoom._id, user_id: userId1 });
                await participantsRepo.create({ room_id: newRoom._id, user_id: userId2 });
                console.log("DM created successfully between users", userId1, userId2, newRoom);
                return newRoom;
            }
        } catch (error) {
            console.log("Error creating DM: ", error);
            throw error;
        }
    }
};

module.exports = RoomService;