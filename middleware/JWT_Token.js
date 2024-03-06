// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACTIVATION_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;


const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
  users = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(users, process.env.ACTIVATION_SECRET, {
    expiresIn: "1h",
  }); 
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
    user,
    token,
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
