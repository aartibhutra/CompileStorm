const User = require('../models/user');
const bcrypt = require('bcrypt');
// const { json } = require('express');
const jwt = require('jsonwebtoken');
const axios = require("axios")

// require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

//utilities
const {signInSchema, signUpSchema} = require('../models/zodSchema');
const {sendEmail} = require('./emailService')

// Signup controller
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email and password' });
    }
    try {
        //zod validation
        const validate = signUpSchema.safeParse({username, email, password});
        if(!validate.success){
            return res.status(400).json("Invalid Inputs!");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Signin controller
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    try {
        //zod validation
        const validate = signInSchema.safeParse({email, password});
        if(!validate.success){
            return res.status(400).json({
                message : "Invalid Inputs!"
            })
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite :'None'
        });
        res.json({ message: 'Signin successful', token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.signout = async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
        return res.status(200).json({ message: "Logged out successfully" }); //remove the cookie named 'token'
    }
    catch(e){
        console.error('Signout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.userDetails = async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(400).json({message : "User not found!"})
        }
        res.status(200).json({
            userData : user
        })
    }
    catch(e){
        console.error("Error fetching user data!");
        res.status(500).json({
            message : 'Internal Server Error'
        })
    }
}

const AvailableLanguages = [
    "java",
    "python",
    "cpp",
    "c",
    "js"
];

exports.runCode = async (req, res) => {
    try {
        const { language, entryFile, input, files } = req.body;

        // Validate available language
        if (!AvailableLanguages.includes(language)) {
            return res.status(400).json({ message: "Unsupported language!" });
        }

        // Validate files object
        if (!files || typeof files !== "object") {
            return res.status(400).json({ message: "Files must be an object!" });
        }

        // Get sandbox compile/run config
        const langConfig = AvailableLanguages.indexOf(language);
        if (langConfig == -1) {
            return res.status(400).json({ message: "Invalid language config!" });
        }

        const payload = {
            language,
            entryFile,
            input: input || "",
            files: files
        };

        console.log("Sending payload to sandbox:", payload);

        const response = await axios.post(
            `${process.env.SANDBOX_URL}/run`,
            payload,
        );

        return res.status(200).json(response.data);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const generateotp = ()=> Math.floor(Math.random()*1000000).toString() 

//forgot password
exports.forgotPassword = async (req,res)=>{
    try{
        const {email} =  req.body;
        const userEmail = email.toLowerCase();

        const user = await User.findOne({email : userEmail});
        if(!user) return res.status(404).json({message : "User not found"})

        const otp = generateotp();

        user.otpToken = otp;
        user.otpExpires = Date.now() + 10*60*1000; //expires in 10 minutes

        await user.save();

        await sendEmail(user.email, "Password reset OTP!", `Your OTP is : ${otp}`);

        res.status(200).json({
            message : "otp sent!"
        })

    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
}

exports.verifyOtp = async (req, res) => {
    try{
        const {otp, email} = req.body;
        const userEmail = email.toLowerCase();

        const user = await User.findOne({email : userEmail});
        if(!user) return res.status(404).json({
            message : "User not found"
        })

        if(Date.now() > user.otpExpires){
            return res.status(400).json({
                message : "OTP expired"
            })
        }

        if(user.otpToken === otp.toString()){
            return res.status(200).json({
                message: "user verified!"
            })
        }

        res.status(400).json({
            message: "Invalid OTP"
        })

    } catch(e) {
        res.status(500).json({
            error : e.message
        })
    }
}

exports.resetPassword = async (req, res) => {
    try{
        const {email, password} = req.body;
        const userEmail = email.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({email : userEmail});
        if(!user) return res.status(404).json({
            message : "User not found"
        })
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message : "Password reset successfully"
        })
    } catch(e) {
        res.status(500).json({
            error : e.message
        })
    }
}