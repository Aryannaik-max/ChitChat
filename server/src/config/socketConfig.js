const {Server} = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./serverConfig');
const ParticipantService = require('../services/participants-service');
const MessageService = require('../services/message-service');
const redisClient = require('./redisConfig');
const participantService = new ParticipantService();
const messageService = new MessageService();
const ONLINE_USERS_SET_KEY = 'onlineUsers';

const resetPresenceState = async () => {
    try {
        if (!redisClient.isReady) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        const keys = await redisClient.keys('user:*:socketCount');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del(ONLINE_USERS_SET_KEY);
        console.log('>>> Presence state reset. Cleared keys:', keys.length);
    } catch (error) {
        console.error('Failed to reset presence state:', error.message);
    }
};

const socketConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    resetPresenceState();

    io.on('connection', async (socket) => {
        console.log(`User connected with socket id: ${socket.id}`);

        const authToken = socket.handshake?.auth?.token;
        if (!authToken) {
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

        const userId = String(socket.user.id);
        const socketCountKey = `user:${userId}:socketCount`;

        try {
            // Fix: check if key exists first to avoid stale counts
            const exists = await redisClient.exists(socketCountKey);
            let count;
            if (!exists) {
                await redisClient.set(socketCountKey, 1);
                count = 1;
            } else {
                count = await redisClient.incr(socketCountKey);
            }

            await redisClient.sAdd(ONLINE_USERS_SET_KEY, userId);

            if (count === 1) {
                io.emit('user-online', { userId });
                console.log(`>>> Emitted user-online for: ${userId}`);
            }

            const onlineUserIds = await redisClient.sMembers(ONLINE_USERS_SET_KEY);
            socket.emit('online-users', { userIds: onlineUserIds || [] });

        } catch (error) {
            console.error('>>> REDIS ERROR on connect:', error.message);
        }

        socket.on('disconnect', async () => {
            console.log(`User disconnected with socket id: ${socket.id}`);
            console.log(`>>> Running disconnect for userId: ${userId}`);

            try {
                const remainingCount = await redisClient.decr(socketCountKey);
                console.log(`>>> remainingCount after decr: ${remainingCount}`);

                if (remainingCount <= 0) {
                    await redisClient.del(socketCountKey);
                    await redisClient.sRem(ONLINE_USERS_SET_KEY, userId);
                    io.emit('user-offline', { userId });
                    console.log(`>>> EMITTED user-offline for: ${userId}`);
                } else {
                    console.log(`>>> User still has ${remainingCount} other connections`);
                }
            } catch (error) {
                console.error(`>>> REDIS ERROR in disconnect:`, error.message);
                // Fallback: force cleanup anyway
                try {
                    await redisClient.del(socketCountKey);
                    await redisClient.sRem(ONLINE_USERS_SET_KEY, userId);
                    io.emit('user-offline', { userId });
                } catch (fallbackError) {
                    console.error('>>> Fallback cleanup also failed:', fallbackError.message);
                }
            }
        });

        socket.on('join-room', async (data, callback) => {
            try {
                const { roomId } = data || {};
                const userId = socket.user.id;
                if (!roomId || !userId) {
                    if (callback) callback({ success: false, message: 'roomId and userId are required' });
                    return;
                }

                socket.join(roomId);

                const existingParticipant = await participantService.findOne({
                    user_id: userId,
                    room_id: roomId,
                });

                if (!existingParticipant) {
                    await participantService.create({ user_id: userId, room_id: roomId });
                }

                console.log(`User with socket id: ${socket.id} joined room: ${roomId}`);
                if (callback) callback({ success: true });
            } catch (error) {
                console.log('Error in join-room:', error);
                if (callback) callback({ success: false, message: 'Failed to join room' });
            }
        });

        socket.on('leave-room', async (data, callback) => {
            try {
                const { roomId } = data || {};
                const userId = socket.user.id;
                if (!roomId || !userId) {
                    if (callback) callback({ success: false, message: 'roomId and userId are required' });
                    return;
                }

                socket.leave(roomId);
                await participantService.delete({ user_id: userId, room_id: roomId });
                console.log(`User with socket id: ${socket.id} left the room: ${roomId}`);
                if (callback) callback({ success: true });
            } catch (error) {
                console.log('Error in leave-room:', error);
                if (callback) callback({ success: false, message: 'Failed to leave room' });
            }
        });

        socket.on('send-message', async (data, callback) => {
            try {
                const { roomId, message, reply_to, type, fileName } = data || {};
                const senderId = socket.user.id;
                const trimmedMessage = typeof message === 'string' ? message.trim() : '';

                if (!roomId || !trimmedMessage) {
                    if (callback) callback({ success: false, message: 'roomId and message are required' });
                    return;
                }

                const createdMessage = await messageService.create({
                    content: trimmedMessage,
                    sender_id: senderId,
                    room_id: roomId,
                    reply_to: reply_to || null,
                    type: type || 'text',
                    fileName: fileName || undefined
                });

                const payload = {
                    _id: createdMessage._id,
                    room_id: createdMessage.room_id,
                    sender_id: createdMessage.sender_id,
                    content: createdMessage.content,
                    createdAt: createdMessage.createdAt,
                    reply_to: createdMessage.reply_to,
                    type: createdMessage.type,
                    fileName: createdMessage.fileName || null
                };

                io.to(roomId).emit('receive-message', payload);
                console.log(`User with socket id: ${socket.id} sent message to room: ${roomId}`);
                if (callback) callback({ success: true, data: payload });
            } catch (error) {
                console.log('Error in send-message:', error);
                if (callback) callback({ success: false, message: error?.message || 'Failed to send message' });
            }
        });

        socket.on('typing', (roomId) => {
            socket.to(roomId).emit('typing', { socketId: socket.id });
        });
    });

    return io;
};

module.exports = socketConfig;