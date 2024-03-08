const bcrypt = require("bcrypt");
const db = require("../database/db");
const sendToken = require("../middleware/JWT_Token");
const axios = require("axios");
const httpstatus = require("../util/httpstatus");
const sendemail = require("../util/sendMail");

const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    fathername,
    familyname,
    mobile_no,
  } = req.body;

  console.log("request:", req.body);
  try {
    const existingUser = await db("users").where({ email }).first();
    console.log("existingUser", existingUser);

    // Check if user already exists
    if (existingUser) {
      if (existingUser.OTP_verify === "Yes") {
        return res.send(
          httpstatus.duplicationResponse({ message: "User already exists" })
        );
      } else {
        // Handle the case where the user exists but email is not verified
        // Update existing user OTP and send OTP again
        const otp = generateOTP();
        const currentTime = new Date();
        const otpExpiryTime = new Date(currentTime.getTime() + 2 * 60 * 1000);
        const apiUrl = `http://sms.gooadvert.com/vendorsms/pushsms.aspx?APIKey=V5j6rtU7tkaCyszEWBYlQQ&msisdn=${mobile_no}&sid=KODUKU&msg=Dear Customer, OTP for login on Kodukku is ${otp} and valid for 2 min. Do not share with anyone&fl=0&gwid=2`;
        const smsResponse = await axios.get(apiUrl);

        await db("users").where("email", email).update({
          OTP_no: otp,
        });

        return res.send(
          httpstatus.successRespone({ message: "OTP resent successfully" })
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const currentTime = new Date();
      const otpExpiryTime = new Date(currentTime.getTime() + 2 * 60 * 1000);
      const apiUrl = `http://sms.gooadvert.com/vendorsms/pushsms.aspx?APIKey=V5j6rtU7tkaCyszEWBYlQQ&msisdn=${mobile_no}&sid=KODUKU&msg=Dear Customer, OTP for login on Kodukku is ${otp} and valid for 2 min. Do not share with anyone&fl=0&gwid=2`;

      await db("users").insert({
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

      await db("users").where("email", email).update({
        created_at: currentTime,
      });

      return res.send(
        httpstatus.successRespone({ message: "User created successfully" })
      );
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.send(
      httpstatus.errorRespone({ message: "Internal server error" })
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


const Logout = async(req,res) => {
  try {
    
  } catch (error) {
    
  }
}

module.exports = {
  signup,
  signin,
  sendOTP,
  otp_verify,
  resetPassword,
  Email_OTP,
  Email_OTP_verify
  
};
