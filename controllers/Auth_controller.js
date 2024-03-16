const bcrypt = require("bcrypt");
const db = require("../database/db");
const sendToken = require("../middleware/JWT_Token");
const axios = require("axios");
const httpstatus = require("../util/httpstatus");
const sendemail = require("../util/sendMail");
const sendSms = require('../util/sendSms');
const { DateTime } = require('luxon');

const signup = async(req, res) => {
 
  try {
    const {
      name,
      email,
      password,
      fathername,
      familyname,
      mobile_no,
    } = req.body;
  
    console.log("request:", req.body);

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const currentTime = new Date();
    const otpExpiryTime = new Date(currentTime.getTime() + 2 * 60 * 1000);

    const AlredyExist = await db('users').select('*').where({email:email,OTP_verify:"Yes"}).first();
    if(AlredyExist){
    return res.send(httpstatus.duplicationResponse({message:'Email already exists.'}));
    }

    const otp_mobile = await db('users').select('*').where({ email:email,mobile_no:mobile_no,OTP_verify:"No" }).first();
    if(otp_mobile){
      sendSms(mobile_no,otp);
     const response = await db('users').update({ OTP_no:otp }).where({email:email,mobile_no:mobile_no,OTP_verify:"No"});
     return res.send(httpstatus.successRespone({
      message:"Verify the opt..!"
     }))
    }

    if(!otp_mobile){
      sendSms(mobile_no,otp);
      const insertUser = await db('users').insert({
        mobile_no,
        name,
        email,
        password: hashedPassword,
        fathername,
        familyname,
        OTP_expiry: otpExpiryTime,
        OTP_no: otp,
        OTP_verify: "No",
      });
      return res.send(httpstatus.successRespone({
        message:"Verify the opt..!"
       }))
    }


  } catch (error) {
    console.error("Error creating user:", error);
    return res.send(
      httpstatus.errorRespone({ message: error })
    );
  }
};





const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db("users").select("*").where("email", email).first();

    if (!user) {
      return res.send(httpstatus.notFoundResponse({ error: "User Not Found" }));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send(
        httpstatus.invalidResponse({ error: "Invalid Email or Password" })
      );
    }
    delete user.password;
    sendToken(user, 201, res);
  } catch (error) {
    res.send(httpstatus.errorRespone({ message: "Internal server error" }));
  }
};

const sendOTP = async (req, res) => {
  console.log("email");
  try {
    const { email, mobile_no } = req.body;
    console.log("sendotp:", req.body);

    const otp = generateOTP();

    const Userexisting = await db("users").where({ email }).first();
    console.log("Userexisting", Userexisting);

    const currentTime = new Date();
    const otpExpiryTime = new Date(currentTime.getTime() + 2 * 60 * 1000);

    const apiUrl = `http://sms.gooadvert.com/vendorsms/pushsms.aspx?APIKey=V5j6rtU7tkaCyszEWBYlQQ&msisdn=${mobile_no}&sid=KODUKU&msg=Dear Customer, OTP for login on Kodukku is ${otp} and valid for 2 min. Do not share with anyone&fl=0&gwid=2`;
    const smsResponse = await axios.get(apiUrl);
    await db("users").where("email", email).update({
      OTP_no: otp,
      created_at: currentTime, // Update created_at column with current time
      OTP_expiry: otpExpiryTime,
    });

    res.send(httpstatus.successRespone({ message: "OTP Sent Successfully" }));
  } catch (error) {
    res.send(httpstatus.errorRespone({ message: "Internal server error" }));
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const otp_verify = async (req, res) => {
  try {
    const { OTP_no } = req.body;
    const stringWithoutCommas = OTP_no.join("");
    console.log("stringWithoutCommas:", stringWithoutCommas);

    const currentTime = new Date();

    const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000);
    console.log("twoMinutesAgo", twoMinutesAgo);

    const user = await db("users")
      .where("OTP_no", stringWithoutCommas)
      .where("created_at", ">=", twoMinutesAgo)
      .first();

    console.log("user", user);

    if (user) {
      await db("users").where("OTP_no", stringWithoutCommas).update({
        OTP_verify: "Yes",
      });

      return res.send(
        httpstatus.successRespone({ success: "OTP Verified Successfully" })
      );
    } else {
      return res.send(
        httpstatus.notFoundResponse({ error: "Incorrect or expired OTP" })
      );
    }
  } catch (error) {
    res.send(httpstatus.errorRespone({ message: "Internal server error" }));
  }
};

const resetPassword = async (req, res) => {
  const { password, confirm_password, email } = req.body;
  console.log("request:", req.body);
  try {
    if (
      !password ||
      !confirm_password ||
      password !== confirm_password ||
      !email
    ) {
      return res
        .status(400)
        .send(
          httpstatus.invalidInputResponse({
            message: "Passwords do not match or are missing",
          })
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db("users").where("email", email).update({
      password: hashedPassword,
    });

    res.send(
      httpstatus.successRespone({ message: "Password updated successfully" })
    );
  } catch (error) {
    console.error("Error resetting password:", error);

    res
      .status(500)
      .send(httpstatus.errorRespone({ message: "Internal server error" }));
  }
};

const Email_OTP = async (req, res) => {
  const { email } = req.body;
  console.log("emaillll:", email);
  try {
    const user = await db("users").select("*").where("email", email).first();

    if (!user) {
      return res.send(httpstatus.notFoundResponse({ error: "User Not Found" }));
    }

    const sixDigitOTP = generateNumericOTP();
    //Update OTP no
    await db("users").where("email", email).update({
      OTP_no: sixDigitOTP,
    });

    try {
      await sendemail({
        email: email,
        subject: "Reset Password OTP",
        message: `Your OTP number is ${sixDigitOTP}`,
      });
      console.log("Email sent successfully");
      return res.send(
        httpstatus.successRespone({ message: "Email Sent Successfully" })
      );
    } catch (error) {
      console.error("Error sending email:", error);
      return res.send(
        httpstatus.errorRespone({ message: "Error Sending Email" })
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return res.send(
      httpstatus.errorRespone({ message: "Internal Server Error" })
    );
  }
};

function generateNumericOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const Email_OTP_verify = async (req, res) => {
  try {
    const { emailOTP } = req.body;
    console.log("emailOTP", emailOTP);
    //database query
    const user_otp = await db("users").where("OTP_no", emailOTP).first();

    console.log("user", user_otp);
    if (user_otp) {
      return res.send(
        httpstatus.successRespone({ success: "OTP Verified Successfully" })
      );
    } else {
      return res.send(httpstatus.notFoundResponse({ error: "Incorrect OTP" }));
    }
  } catch (error) {
    res.send(httpstatus.errorRespone({ message: "Internal server error" }));
  }
};


 const updateMailOtp = async(req,res) => {
   try {
   const { email } = req.body;

   const currentDate = new Date();
   const formattedDate = currentDate.toISOString().slice(0, 23).replace('T', ' ');
   console.log(formattedDate);
   
   const getdata = await db('users').select('*').where({ email:email }).first();
   if(!getdata){
    return res.send(httpstatus.notFoundResponse({ message: 'Please Enter Your Valid Email...' }));
   }

    const sixDigitOTP = generateNumericOTP();
    const currentTimeUTC = new Date();

// Convert UTC to Indian Standard Time (IST)
const ISTOffset = 5.5 * 60 * 60 * 1000;
const indianTime = new Date(currentTimeUTC.getTime() + ISTOffset);
   console.log('indianTime',indianTime)
    try {
      await sendemail({
        email: email,
        subject: "Reset Password OTP",
        message: `Your OTP number is ${sixDigitOTP}`,
      });
      await db('users').update({ email_otp:sixDigitOTP,email_verify:'No',updated_at:indianTime.toISOString().slice(0, 19).replace('T', ' ') }).where({ email:email });
      return res.send(
       httpstatus.successRespone({ message: "Please Check Your email" })
     );


    } catch (error) {
      console.error("Error sending email:", error);
      return res.send(
        httpstatus.errorRespone({ message: "Error Sending Email" })
      );
    }

    
   } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
   }
 }


 const updateMobileOtp = async(req,res) => {
  try {
    const sixDigitOTP = generateNumericOTP();
  const { email,mobile } = req.body;

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 23).replace('T', ' ');
  console.log(formattedDate);
  
  const getdata = await db('users').select('*').where({ email:email,mobile_no:mobile }).first();
  if(!getdata){
   return res.send(httpstatus.notFoundResponse({ message: 'Please Enter Valid Credentials..' }));
  }
  await db('users').update({ mobile_otp:sixDigitOTP,mobile_verify:'No',updated_at:db.raw('GETDATE()') }).where({ email:email });
   
   sendSms(mobile,sixDigitOTP);
   return res.send(
    httpstatus.successRespone({ message: "Please Check Your SMS" })
  );

  } catch (error) {
   return res.send(httpstatus.errorRespone({ message: error.message }));
  }
}


 const validateEmailOtp = async(req,res) => {
  try {
    const { email,otp } = req.body;
    console.log('validate otp',req.body);
    const validateEmail = await db('users')
    .select('*', db.raw("CONVERT(varchar, updated_at, 120) AS formatted_date"))
    .where({ email: email, email_otp: otp })
    .first();
  
     
    if(!validateEmail){
      return res.send(
        httpstatus.errorRespone({ message: "Please Enter Valid Otp" })
      );
      
    }

    const allowedEditingTime = 2; // 2 minutes
    const currentTime = new Date();
    const createdAt = new Date(validateEmail.formatted_date);

    // Calculate the time difference in minutes
    const timeDifferenceInMilliseconds = currentTime - createdAt;
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    
    
    if (timeDifferenceInMinutes <= allowedEditingTime) {
      // Within allowed editing time
      await db('users').update({ email_verify: "Yes" }).where({ email_otp: otp, email: email });
      return res.send(httpstatus.successRespone({ message: "OTP Verified Successfully",createdAt:currentTime }));
    } else {
      // Beyond allowed editing time
      return res.send(httpstatus.errorRespone({ message: "Please Enter Valid OTP expiry" }));
      console.log('createdAt:', createdAt);
    
    }
    

    
  } catch (error) {
    console.log('createdAt:', 'createdAt');
    
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
 }


 const validateMobileOtp = async(req,res) => {
  try {
    const { mobile,otp } = req.body;
    const validateMobile = await db('users')
    .select('*', db.raw("CONVERT(varchar, updated_at, 120) AS formatted_date"))
    .where({ mobile_no:mobile,mobile_otp:otp })
    .first();
    if(!validateMobile){
      return res.send(
        httpstatus.errorRespone({ message: "Please Enter Valid Otp" })
      );
      
    }

    const allowedEditingTime = 2; // 2 minutes
    const currentTime = new Date();
    const createdAt = new Date(validateMobile.formatted_date);

    // Calculate the time difference in minutes
    const timeDifferenceInMilliseconds = currentTime - createdAt;
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    
    
    if (timeDifferenceInMinutes <= allowedEditingTime) {
      // Within allowed editing time
      await db('users').update({ mobile_verify:"Yes" }).where({ mobile_otp:otp,mobile_no:mobile });
      return res.send(
        httpstatus.successRespone({ message: "OTP Verified Successfully" })
      );
    } else {
      // Beyond allowed editing time
      return res.send(httpstatus.errorRespone({ message: "Please Enter Valid OTP expiry" }));
   
    }


    
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
 }

 const changePasswordRequest = async(req,res) => {
  try {
     const { email,mobile,password,dob } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);

     const fetchUser = await db('users').select('*').where({email:email,mobile_no:mobile,dob:dob}).first();
     if(!fetchUser){
      return res.send(
        httpstatus.errorRespone({ message: "Please Enter Valid Dob" })
      );
     }
     
     await db('users').update({ password:hashedPassword }).where({ email:email,mobile_no:mobile });
     return res.send(
      httpstatus.successRespone({ message: "Password Reset Successfully.." })
    );
  } catch (error) {
    return res.send(httpstatus.errorRespone({ message: error.message }));
  }
 }


  const update_time_otp = async(req,res) => {
    try {
      const { email,mobile,data } = req.body;
      const OTP = generateNumericOTP();

      if(data == 'completetime'){
        await db('users').update({email_otp:'NULL'}).where({ email:email });
      }

      if(data == 'completeMobileTime'){
        await db('users').update({mobile_otp:'NULL'}).where({ mobile_no:mobile });
      }
      if(data == 'email'){
        await sendemail({
          email: email,
          subject: "Reset Password OTP",
          message: `Your OTP number is ${OTP}`,
        });
        await db('users').update({email_otp:OTP}).where({ email:email });
      }
    
      if(data == 'mobile'){
        sendSms(mobile,OTP);
        await db('users').update({mobile_otp:OTP}).where({ email:email,mobile_no:mobile });
      }

    } catch (error) {
      return res.send(httpstatus.errorRespone({ message: error.message }));
    }
  }


  const resendMailOtp = async(req, res) => {
    const { email } = req.body;
    const OTP = generateNumericOTP();
    try {
      await sendemail({
        email: email,
        subject: "Reset Password OTP",
        message: `Your OTP number is ${OTP}`,
      });
      await db('users').update({email_otp:OTP,updated_at:db.raw('GETDATE()')}).where({email:email});
      return res.send(
        httpstatus.successRespone({ message: "Mail Resend Successfully..." })
      );
    } catch (error) {
      return res.send(httpstatus.errorRespone({ message: error.message }));
    }
  }

  const resendMobileOtp = async(req, res) => {
    const { email,mobile } = req.body;
    const OTP = generateNumericOTP();
    try {
      sendSms(mobile,OTP);
      await db('users').update({mobile_otp:OTP,updated_at:db.raw('GETDATE()')}).where({email:email});
      return res.send(
        httpstatus.successRespone({ message: "Sms Resend Successfully..." })
      );
    } catch (error) {
      return res.send(httpstatus.errorRespone({ message: error.message }));
    }
  }

module.exports = {
  signup,
  signin,
  sendOTP,
  otp_verify,
  resetPassword,
  Email_OTP,
  Email_OTP_verify,
  updateMailOtp,
  validateEmailOtp,
  updateMobileOtp,
  validateMobileOtp,
  changePasswordRequest,
  update_time_otp,
  resendMailOtp,
  resendMobileOtp
};
