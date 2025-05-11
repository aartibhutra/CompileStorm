const express = require('express');
const router = express.Router();
const {signup, signin, userDetails} = require("../controllers/compile")
const verifyToken = require('../middleware/verifytoken');
const { verify } = require('jsonwebtoken');

// Signup route
router.post('/signup', signup);
// Signin route
router.post('/signin', signin);

router.get('/userDetails', verifyToken,  userDetails);

// EndPoints
// router.post('runCode', verifyToken, runCode)


module.exports = router;
