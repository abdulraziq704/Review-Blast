// index.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Force specific path
const express = require('express');

const cors = require('cors');
// ... rest of your imports
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
app.set("trust proxy", 1);
// Connect to Database
connectDB();

// Environment Variable Validation
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
requiredEnv.forEach(env => {
    if (!process.env[env]) {
        console.error(`❌ CRITICAL ERROR: ${env} is missing in environment variables!`);
    } else {
        console.log(`✅ ${env} is set.`);
    }
});

const allowedOrigins = [
    'https://reviewblast.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://loan-nonfanatical-overdiffusely.ngrok-free.dev',
    'https://reviewblast-git-main-abdullraziqs-projects.vercel.app',
    'https://reviewblast-of4bpum5v-abdullraziqs-projects.vercel.app',
    'https://reviewblast.up.railway.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(cookieParser());
const fs = require('fs');
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    try {
        const log = `${new Date().toISOString()} - ${req.method} ${req.url} - Cookies: ${JSON.stringify(req.cookies || {})}\n`;
        fs.appendFileSync(path.join(__dirname, 'debug.log'), log);
        console.log('Successfully wrote to debug.log');
    } catch (err) {
        console.error('Failed to write to debug.log:', err.message);
    }
    next();
});
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// WhatsApp Status Callback (Public endpoint for Twilio)
app.post('/api/whatsapp/status', async (req, res) => {
    const { MessageSid, MessageStatus, To, From } = req.body;
    console.log(`📊 WhatsApp Status Received: SID=${MessageSid}, Status=${MessageStatus}`);

    try {
        const Contact = require('./models/Contact');

        // Find contact by Message SID
        let contact = await Contact.findOne({ lastMessageSid: MessageSid });

        if (!contact && To) {
            // Fallback: search by phone number (removing 'whatsapp:' prefix)
            const phoneNumber = To.replace('whatsapp:', '');
            contact = await Contact.findOne({ phone: phoneNumber });
        }

        if (contact) {
            contact.status = MessageStatus;
            await contact.save();
            console.log(`✅ Updated status for ${contact.name} to ${MessageStatus}`);
        } else {
            console.log(`⚠️ No contact found for SID: ${MessageSid}`);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Status Callback Error:', error);
        res.sendStatus(500);
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`❌ Global Error: ${err.message}`);
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});