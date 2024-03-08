


const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
  
  const token = jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "1h",
  }); 

  console.log('token ');
  

  const options = {
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes in milliseconds
    httpOnly: true,
  };
  res.cookie('authToken', token, options);
   console.log('options',options);
  return res.status(statusCode).json({
    message: "Successfully Loged",
    success: true,
    code:200,
    user:{
      user:user,
      token:token
    },
    
  });
};

module.exports = sendToken;





// const axios = require('axios');

// // Function to generate a random OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// };

// // Function to send OTP via SMS API
// const sendOTP = async (phoneNumber, otp) => {
//   try {
//     const apiKey = 'YOUR_API_KEY'; // Replace with your API key
//     const message = `Your OTP is: ${otp}`;

//     const response = await axios.post('SMS_API_ENDPOINT', {
//       apiKey,
//       phoneNumber,
//       message,
//     });

//     console.log('OTP sent successfully:', response.data);
//   } catch (error) {
//     console.error('Error sending OTP:', error.response.data);
//   }
// };

// // Usage example
// const phoneNumber = 'RECIPIENT_PHONE_NUMBER';
// const otp = generateOTP();

// sendOTP(phoneNumber, otp);
