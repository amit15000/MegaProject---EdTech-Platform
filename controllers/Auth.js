const { generate } = require("otp-generator");
const OTP = require("../models/OTP");
const User = require("../models/Users");
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  //check if user already exist
  try {
    const checkUserExist = await User.findOne({ email });
    if (checkUserExist) {
      return res.json({
        success: false,
        message: "User Already Exist",
      });
    }

    //new user--> generate otp
    let newOTP = generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    let sameOTP = OTP.findOne({ otp: newOTP });
    while (sameOTP) {
      newOTP = generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
      });
      sameOTP = OTP.findOne({ otp: newOTP });
    }
    console.log(sameOTP);
    const otpPayload = { email, sameOTP };
    //create entry in database
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      sameOTP,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
//signup
exports.signup = async (req, res) => {
  try {
    //data fetch from req
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;
    //validation
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return res.json({
        success: false,
        message: "All fields are to be filled",
      });
    }

    //check if user already exist

    const existingUser = await Users.find({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exist",
      });
    }
    //new user ---> check password mathcing

    if (password != confirmPassword) {
      return res.json({
        success: false,
        message: "Password do not match",
      });
    }

    //find most recent otp
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOTP);

    //otp validation
    if (otp != recentOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //hash password
    const hashedPass = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPass,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "User cannot be registered, Please try again",
    });
  }
  //save to database
};

exports.login = async (req, res) => {
  try {
    //data fetch from form
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are compulsory",
      });
    }
    //check if user not exist
    const user = await User.find({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "SignUp before login",
      });
    }
    //fetch pasword from the database

    //user exists=>match password

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2hr",
      });
      //send cookie
      user = user.toObject();
      user = user.token;
      user.password = undefined;
      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      res.cookie("token", token, options).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "Password Do Not Match",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Login failure, please try again",
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    //data fetch
    const { oldPassword, newPassword, confirmPassword } = req.body;
    //validation
    //get user's details from the token
    const { token } = req.req.cookies;
    const decodeToken = jwt.decode(token);
    const savePassword = await User.find({ _id: decodeToken.id });
  } catch (error) {}

  //check if passowrd matchs
};
