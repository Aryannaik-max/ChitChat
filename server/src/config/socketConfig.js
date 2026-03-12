const {Server} = require('socket.io');

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

        
    });

    return io;
};

module.exports = socketConfig;