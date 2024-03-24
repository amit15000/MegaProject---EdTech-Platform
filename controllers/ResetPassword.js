//  Reset Password Token

const Users = require("../models/Users");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req.body
    const email = req.body.email;

    const user = Users.find({ email: email });

    //check if email is valid
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email Address",
      });
    }
    // generate a token
    const token = crypto.randomUUID();
    //add token  and expiry time to User model of that user
    const updatedDetails = User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );

    //create url

    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing the url
    await mailSender(
      email,
      "Password Reset Link From StudySphere",
      `Your password reset link : ${url}`
    );
    //return response
    return res.json({
      success: true,
      message:
        "Email sent successfully, Please check email and change password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

//reset
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password != confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }
    const userDetails = User.find({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token invalid",
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expired",
      });
    }
    //hash password
    const hashedPassord = await bcrypt.hash(password, 10);

    // password update
    await Users.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassord,
      },
      {
        new: true,
      }
    );

    return res.json({
      success: true,
      message: "Pasword updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
    });
  }
};
