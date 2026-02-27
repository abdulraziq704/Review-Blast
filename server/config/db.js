const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Force log the URI to see if it's actually reading from .env
 
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env file!");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;