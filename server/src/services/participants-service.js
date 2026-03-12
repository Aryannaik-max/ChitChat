const CrudService = require('./crud-service');
const ParticipantsRepository = require('../repositories/participants-repo');

class ParticipantsService extends CrudService {
    constructor() {
        const participantsRepository = new ParticipantsRepository();
        super(participantsRepository);
    }
};

moduole.exports = ParticipantsService;