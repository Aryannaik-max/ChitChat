const CrudRepository = require('./crud-repo');
const Room = require('../models/room');

class RoomRepository extends CrudRepository {
    constructor() {
        super(Room);
    }
};

module.exports = RoomRepository;