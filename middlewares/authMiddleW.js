const jwt = require("jsonwebtoken");
require("dotenv").config();
//is authorized
exports.isAuthorized = async (req, res, next) => {
  try {
    //get token from cookie, req body

    const { token } =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Missing, Login first",
      });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      //valid token
      console.log("You are authenticated user", decodedToken);
      req.user = decodedToken;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication Failed",
    });
  }
};
//isStudent
exports.isStudent = async (req, res) => {
  try {
    if (req.user.accountType != "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Students only",
      });
      next();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cann't be verified, Please try again",
    });
  }
};
//isInstructor
//isAdmin
