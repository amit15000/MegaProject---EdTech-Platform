const Users = require("../models/Users");
const mailSender = require("../utils/mailSender");

//reset Passwor Token
exports.resetPasswordToken = async (req, res) => {
  try {
    //fetch data
    const { email } = req.body;

    //check if email exists

    const user = await Users.find({ email: email });

    if (!user) {
      return res.json({
        sucess: false,
        message: "Email not registered, Check your email",
      });
    }
    //update user with updated token and expiryTime
    const token = crypto.randomUUID();
    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordToken: Date.now() * 5 * 60 * 1000 }
    );

    //send mail
    const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(
      email,
      "Reset Password for StudySphere",
      `Click to change your password : ${url}`
    );
    return res.status(200).json({
      sucess: true,
      message: "Email sent successfully, Please check your mail",
    });
  } catch (error) {
    return res.status(200).json({
      sucess: false,
      message: "Error while sending Password Reset Link to mail",
    });
  }
};

//reset
