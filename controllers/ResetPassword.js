const Users = require("../models/Users");

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
    //insert token and send mail
    const token = crypto.randomUUID();
    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordToken: Date.now() * 5 * 60 * 1000 }
    );
  } catch (error) {}
};

//reset
