const express = require('express')
const router = express.Router()
const {signup,signin,sendOTP,otp_verify,resetPassword,Email_OTP,Email_OTP_verify,
    updateMailOtp,
    validateEmailOtp,
    updateMobileOtp,
    validateMobileOtp,
    changePasswordRequest,
    update_time_otp,
    resendMailOtp,
    resendMobileOtp
} = require('../controllers/Auth_controller')


router.post('/signup',signup)
router.post('/signin',signin)
router.post('/mobile',sendOTP)
router.post('/otp_no',otp_verify)
router.post('/resetpassword',resetPassword)
router.post('/email_OTP',Email_OTP)
router.post('/email_OTP_verify',Email_OTP_verify)
router.post('/updatemailotp',updateMailOtp)
router.post('/validate_email',validateEmailOtp)
router.post('/update_otp',updateMobileOtp)
router.post('/update_mobile_otp',validateMobileOtp)
router.post('/reset_password',changePasswordRequest)
router.post('/resend_otp',update_time_otp)
router.post('/sendMail',resendMailOtp)
router.post('/sendMobile',resendMobileOtp)

module.exports = router;