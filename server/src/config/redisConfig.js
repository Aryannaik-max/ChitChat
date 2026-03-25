const { createClient } = require('redis');
const { REDIS_URL } = require('./serverConfig')

const redisClient = createClient({
    url:REDIS_URL
});

redisClient.on("error", (error) => {
    console.log("Redis Client Error: ", error);
});

module.exports = redisClient;