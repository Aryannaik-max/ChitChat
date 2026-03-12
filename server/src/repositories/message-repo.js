const CrudRepository = require('./crud-repo');
const Message = require('../models/message');

class MessageRepository extends CrudRepository {
    constructor() {
        super(Message);
    }
};

module.exports = MessageRepository;