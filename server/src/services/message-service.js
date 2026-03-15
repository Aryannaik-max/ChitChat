const CrudService = require('./crud-service');
const MessageRepository = require('../repositories/message-repo');

class MessageService extends CrudService {
    constructor() {
        const messageRepository = new MessageRepository();
        super(messageRepository);
    }

    async getMessagesByRoomId(roomid) {
        try {
            const messages = await this.repository.findOne({room_id: roomid}).populate('sender_id');
            return messages;
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = MessageService;