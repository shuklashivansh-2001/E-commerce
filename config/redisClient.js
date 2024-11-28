const  { createClient } = require('redis');
require('dotenv').config();

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL, // Redis connection URL
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
};

connectRedis();

module.exports = redisClient;

