//reset Passwor Token

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
