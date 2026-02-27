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

// Connect to Database
connectDB();

// CORS MUST be first!
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://loan-nonfanatical-overdiffusely.ngrok-free.dev' // Add your ngrok link here!
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
