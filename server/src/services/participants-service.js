const CrudService = require('./crud-service');
const ParticipantsRepository = require('../repositories/participants-repo');

class ParticipantsService extends CrudService {
    constructor() {
        const participantsRepository = new ParticipantsRepository();
        super(participantsRepository);
    }
    async getRoomById(userid) {
            try {
               const participant = await this.repository.findOne({user_id: userid}).populate('room_id');
               const room = participant.map((p) => p.room_id);
               return room;
            } catch (error) {
                console.log(error);
            }
        }
    
        async getUsersInRoom(roomid) {
            try {
                const participant = await this.repository.findOne({room_id: roomid}).populate('user_id');
                const users = participant.map((p) => p.user_id);
                return users;
            } catch (error) {
                console.log(error);
            }
        }
};

module.exports = ParticipantsService;