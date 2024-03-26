const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true,
  },
  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  accountType: {
    type: String,
    enum: ("Student", "Instructor", "Admin"),
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  image: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  courseProgress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseProgress",
  },
});
module.exports = mongoose.model("User", userSchema);
