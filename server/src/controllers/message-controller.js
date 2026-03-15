const MessageService = require('../services/message-service');
const messageService = new MessageService();

const createMessage = async (req, res) => {
    try {
        const data = req.body;
        const message = await messageService.create(data);
        return res.status(201).json({
            data: message,
            success: true,
            message: 'Successfully created a message',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a message',
            err: error
        });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const message = await messageService.delete(id);
        if(!message) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'Message not found',
                err: {}
            });
        }

        return res.status(200).json({
            data: message,
            success: true,
            message: 'Successfully deleted the message',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to delete the message',
            err: error
        });
    }
}

const getMessagesByRoomId = async (req, res) => {
    try {
        const roomid = req.params.roomid;
        const messages = await messageService.getMessagesByRoomId(roomid);
        if(!messages) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'No messages found in the room',
                err: {}
            });
        }

        return res.status(200).json({
            data: messages,
            success: true,
            message: 'Successfully fetched the messages in the room',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetched the messages in the room',
            err: error
        });
    }
}

module.exports = {
    createMessage,
    deleteMessage,
    getMessagesByRoomId
}