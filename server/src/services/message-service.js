const CrudService = require('./crud-service');
const MessageRepository = require('../repositories/message-repo');
const redisClient = require('../config/redisConfig');

class MessageService extends CrudService {
    constructor() {
        const messageRepository = new MessageRepository();
        super(messageRepository);
    }
    async create(data) {
        try {
            const result = await super.create(data);
            const cacheKey = `messages:${data.room_id}`;
            await redisClient.del(cacheKey);
            console.log("Cache invalidated for room: ", data.room_id);
            return result;
        } catch (error) {
            console.log("Error creating message in MessageService: ", error);
            throw error;
        }

    }

    async delete(filter) {
        try {
            const message = await this.repository.model.findOne(filter);
            if(message) {
                const result = await super.delete(filter);
                const chacheKey = `messages:${message.room_id}`;
                await redisClient.del(chacheKey);
                console.log("Cache invalidated for room: ", message.room_id);
                return result;
            }
        } catch (error) {
            console.log("Error deleting message in MessageService: ", error);
            throw error;
        }
    }
    async getMessagesByRoomId(roomid) {
        try {
            const cacheKey = `messages:${roomid}`;
            const cachedMessages = await redisClient.get(cacheKey);
            if(cachedMessages) {
                console.log("Messages fetched from cache for room: ", roomid);
                return JSON.parse(cachedMessages);
            }
            console.log("Messages fetched from database for room: ", roomid);
            const messages = await this.repository.model.find({room_id: roomid}).populate('sender_id').sort({ createdAt: 1 });
            await redisClient.set(cacheKey, JSON.stringify(messages), { EX: 60 });
            return messages;
        } catch (error) {
            console.log(error);
            throw error;    
        }
    }
};

module.exports = MessageService;