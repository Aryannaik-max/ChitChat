    const {Server} = require('socket.io');
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('./serverConfig');
    const ParticipantService = require('../services/participants-service');
    const MessageService = require('../services/message-service');
    const participantService = new ParticipantService();
    const messageService = new MessageService();

    const socketConfig = (server) => {
        const io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log(`User connected with socket id: ${socket.id}`);
            const authToken = socket.handshake?.auth?.token;
            if(!authToken) {
                console.log('No token provided in socket connection');
                socket.disconnect();
                return;
            }
            try {
                const token = authToken.startsWith('Bearer ') ? authToken.split(' ')[1] : authToken;
                const decoded = jwt.verify(token, JWT_SECRET);
                socket.user = decoded;
                console.log('Socket authenticated for user: ', decoded.email);
            } catch (error) {
                console.log('Invalid token in socket connection: ', error);
                socket.disconnect();
                return;
            }

            socket.on('disconnect',() => {
                console.log(`User disconnected with socket id: ${socket.id}`);
            });

            socket.on('join-room', async (data, callback) => {
                try {
                    const {roomId} = data || {};
                    const userId = socket.user.id;
                    if (!roomId || !userId) {
                        if (callback) callback({success: false, message: 'roomId and userId are required'});
                        return;
                    }

                    socket.join(roomId);

                    const existingParticipant = await participantService.findOne({
                        user_id: userId,
                        room_id: roomId,
                    });

                    if (!existingParticipant) {
                        await participantService.create({user_id: userId, room_id: roomId});
                    }

                    console.log(`User with socket id: ${socket.id} joined room: ${roomId}`);
                    if (callback) callback({success: true});
                } catch (error) {
                    console.log('Error in join-room:', error);
                    if (callback) callback({success: false, message: 'Failed to join room'});
                }
            });

            socket.on('leave-room', async (data, callback) => {
                try {
                    const {roomId} = data || {};
                    const userId = socket.user.id;
                    if (!roomId || !userId) {
                        if (callback) callback({success: false, message: 'roomId and userId are required'});
                        return;
                    }

                    socket.leave(roomId);
                    await participantService.delete({user_id: userId, room_id: roomId});
                    console.log(`User with socket id: ${socket.id} left the room: ${roomId}`);
                    if (callback) callback({success: true});
                } catch (error) {
                    console.log('Error in leave-room:', error);
                    if (callback) callback({success: false, message: 'Failed to leave room'});
                }
            });
            
            socket.on('send-message', async (data, callback) => {
                try {
                    const {roomId, message, reply_to} = data || {};
                    const senderId = socket.user.id;
                    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

                    if (!roomId || !senderId || !trimmedMessage) {
                        if (callback) callback({success: false, message: 'roomId, senderId and message are required'});
                        return;
                    }

                    const createdMessage = await messageService.create({
                        content: trimmedMessage,
                        sender_id: senderId,
                        room_id: roomId,
                        reply_to: reply_to || null
                    });

                    const payload = {
                        _id: createdMessage._id,
                        room_id: createdMessage.room_id,
                        sender_id: createdMessage.sender_id,
                        content: createdMessage.content,
                        createdAt: createdMessage.createdAt,
                        reply_to: createdMessage.reply_to
                    };

                    io.to(roomId).emit('receive-message', payload);
                    console.log(`User with socket id: ${socket.id} sent message to room: ${roomId}`);
                    if (callback) callback({success: true, data: payload});
                } catch (error) {
                    console.log('Error in send-message:', error);
                    if (callback) callback({success: false, message: 'Failed to send message'});
                }
            });

            socket.on('typing', (roomId) => {
                socket.to(roomId).emit('typing', {socketId: socket.id});
            });
        });

        return io;
    };

    module.exports = socketConfig;