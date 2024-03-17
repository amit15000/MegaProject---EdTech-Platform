const { generate } = require("otp-generator");
const OTP = require("../models/OTP");
const User = require("../models/Users");

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
