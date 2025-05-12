const express = require('express');
const router = express.Router();
const {signup, signin, signout, userDetails, runCode, forgotPassword, verifyOtp, resetPassword} = require("../controllers/compile")
const verifyToken = require('../middleware/verifytoken');
// const { verify } = require('jsonwebtoken');

// Signup route
router.post('/signup', signup);
// Signin route
router.post('/signin', signin);
// Signout route
router.post("/signout", signout);

router.get('/userDetails', verifyToken,  userDetails);

// EndPoints
router.post('/runCode', verifyToken, runCode)

//forgot-password
router.post("/forgotpassword", forgotPassword)

//verify-otp
router.post("/verifyotp", verifyOtp)

//reset password
router.post("/resetpassword", resetPassword)

module.exports = router;
