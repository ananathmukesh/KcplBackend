// app.js
const axios = require('axios');

// Function to send an SMS
async function sendSMS(mobileNo, otp) {
  // Your SMS API endpoint and parameters
  const apiEndpoint = process.env.SMS_ENDPOINT;
  const apiKey = process.env.SMS_API; // Assuming MSG_API_KEY is your actual API key environment variable
  const recipientNumber = mobileNo;
  const senderId = process.env.SMS_SENDER;
  
  const message = `Greetings from Kodukku.com !!. OTP to Reset your password is ${otp} valid for 2 minutes. Keep enjoying our services.`;
  const flash = process.env.SMS_FLASH;
  const gatewayId = process.env.SMS_GATEWAYID;

  try {
    const response = await axios.get(apiEndpoint, {
      params: {
        APIKey: apiKey,
        msisdn: recipientNumber,
        sid: senderId,
        msg: message,
        fl: flash,
        gwid: gatewayId,
      },
    });

    console.log('SMS sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

// Export the function
module.exports = sendSMS;
