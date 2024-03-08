const express = require('express')
const router = express.Router()
const {signup,signin,sendOTP,otp_verify,resetPassword,Email_OTP,Email_OTP_verify} = require('../controllers/Auth_controller')


router.post('/signup',signup)
router.post('/signin',signin)
router.post('/mobile',sendOTP)
router.post('/otp_no',otp_verify)
router.post('/resetpassword',resetPassword)
router.post('/email_OTP',Email_OTP)
router.post('/email_OTP_verify',Email_OTP_verify)

module.exports = router;