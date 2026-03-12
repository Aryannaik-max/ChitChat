const CrudService = require('./crud-service');
const MessageRepository = require('../repositories/message-repo');

class MessageService extends CrudService {
    constructor() {
        const messageRepository = new MessageRepository();
        super(messageRepository);
    }
};

module.exports = MessageRepository;