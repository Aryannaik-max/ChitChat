const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const {PORT} = require('./config/serverConfig');
const passport = require('./config/passportConfig');
const socketConfig = require('./config/socketConfig');
const redisClient = require('./config/redisConfig');
const http = require('http');
const app = express();
const server = http.createServer(app);
const routes = require('./routes/index');


const startServer = async () => {
    await connectDB();
    socketConfig(server);
    await redisClient.connect();
    app.use(cors());
    app.use(passport.initialize());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/api',routes);
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
