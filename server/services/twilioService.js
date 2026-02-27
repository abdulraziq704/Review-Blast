const twilio = require('twilio');

const sendWhatsAppMessage = async (to, templateVariables, contentSid) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new twilio(accountSid, authToken);

    try {
      const messageParams = {
    // DO NOT use "from:". Use "messagingServiceSid:" for live messages
    messagingServiceSid: process.env.MESSAGING_SERVICE_ID, 
    to: `whatsapp:${to}`,
    contentSid: contentSid,
    contentVariables: JSON.stringify(templateVariables),
    statusCallback: process.env.STATUS_CALLBACK_URL
};

        const message = await client.messages.create(messageParams);

        console.log(`✅ Message SID created for ${to}: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error(`❌ Error creating message for ${to}:`, error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppMessage };