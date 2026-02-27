# MERN WhatsApp Review Bot

A scalable MERN stack application to manage contacts and send automated WhatsApp review requests via Twilio.

## Features
- **Authentication**: Secure Login/Register for business owners.
- **Contact Management**: Add contacts manually or upload via CSV.
- **Dashboard**: View total contacts and message stats.
- **WhatsApp Campaign**: Send review request templates to all contacts.

## Prerequisites
- Node.js
- MongoDB (running locally or URI)
- Twilio Account (SID, Auth Token, WhatsApp Number)

## Setup

### 1. Backend (Server)
```bash
cd server
npm install
```
Create a `.env` file in `server/` with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-review-bot
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number
```
To run:
```bash
npm run dev
```

### 2. Frontend (Client)
```bash
cd client
npm install
npm run dev
```

## Usage
1. Register an account.
2. Go to Contacts and upload a CSV (Headers: `name`, `phone`, `email`).
3. Go to Send Reviews to trigger the WhatsApp blast.

## Live Testing Checklist (ngrok & Twilio)

To test WhatsApp delivery and status callbacks locally:

### 1. Start ngrok
Expose your local server to the internet:
```bash
ngrok http 5000
```
Copy the `https` Forwarding URL (e.g., `https://xxxx-xxxx.ngrok-free.dev`).

### 2. Update .env
Add these variables to your `server/.env`:
```env
STATUS_CALLBACK_URL=https://xxxx-xxxx.ngrok-free.dev/api/whatsapp/status
Messaging_ServiceID=MGxxxx... (Optional, if using Twilio Messaging Service)
```

### 3. Twilio WhatsApp Configuration
1. Go to **Twilio Console** > **Messaging** > **Try it Out** > **Send a WhatsApp Message**.
2. In the Sandbox settings (or your Phone Number settings if live), set the **Status Callback URL** to:
   `https://xxxx-xxxx.ngrok-free.dev/api/whatsapp/status`
3. Ensure the HTTP method is set to `POST`.

### 4. Verify Workflow
1. Send a review request from the dashboard.
2. Watch the server console for `📊 WhatsApp Status Received`.
3. Check the `Contacts` table; the status should update from `sent` to `delivered` or `read` in real-time.

