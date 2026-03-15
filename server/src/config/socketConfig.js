const {Server} = require('socket.io');
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

        socket.on('disconnect',() => {
            console.log(`User disconnected with socket id: ${socket.id}`);
        });

        socket.on('join-room', async (data) => {
            const {roomId, userId} = data;
            socket.join(roomId);
            await participantService.create({user_id: userId, room_id: roomId});
            console.log(`User with socket id: ${socket.id} joined room: ${roomId}`);
        });

        socket.on('leave-room', async (data) => {
            const {roomId, userId} = data;
            socket.leave(roomId);
            await participantService.delete({user_id: userId, room_id: roomId});
            console.log(`User with socket id: ${socket.id} left the room: ${roomId}`);
        });
        
        socket.on('send-message', async (data) => {
            const {roomId, message, senderId} = data;
            io.to(roomId).emit('receive-message', {
                message,
                senderId,
                timestamp: new Date()
            });
            await messageService.create({content: message, sender_id: senderId, room_id: roomId});  
            console.log(`User with socket id: ${socket.id} sent message to room: ${roomId}`);
        });

        socket.on('typing', (roomId) => {
            socket.to(roomId).emit('typing', {socketId: socket.id});
        });
    });

    return io;
};

module.exports = socketConfig;