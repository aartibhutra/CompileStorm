const express = require('express');
const router = express.Router();
const {signup, signin, signout, userDetails, runCode} = require("../controllers/compile")
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


module.exports = router;
