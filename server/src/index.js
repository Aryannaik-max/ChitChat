const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const {PORT} = require('./config/serverConfig');
const app = express();

const startServer = async () => {
    app.use(cors({
        origin: '*',
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    connectDB();
    app.listen(PORT, () => {
        console.log("Server listening on port: ", PORT);
    });
}

startServer();
