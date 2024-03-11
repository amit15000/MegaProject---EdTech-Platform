const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  desctiption: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  additionalUrl: {
    type: String,
  },
});
module.exports = mongoose.model("SubSection", subSectionSchema);
