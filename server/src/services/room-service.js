const CrudService = require('./crud-service');
const RoomRepository = require('../repositories/room-repo');

class RoomService extends CrudService {
    constructor() {
        const roomRepository = new RoomRepository();
        super(roomRepository);
    }
};

module.exports = RoomService;