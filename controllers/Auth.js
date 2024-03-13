const User = require("../models/Users");

//send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  //check if user already exist
  try {
    const checkUserExist = await User.findOne({ email });
    if (checkUserExist) {
      return;
    }
  } catch (error) {}
};
