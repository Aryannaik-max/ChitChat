const CrudRepository = require('./crud-repo');
const Participants = require('../models/participants');

class ParticipantsRepository extends CrudRepository {
    constructor() {
        super(Participants);
    }
};

module.exports = ParticipantsRepository;