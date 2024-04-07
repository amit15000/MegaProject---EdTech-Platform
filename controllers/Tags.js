const Tags = require("../models/Tags");

exports.Tags = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.json({
        succes: false,
        message: "All fields are required",
      });
    }
    //create a db entry
    const tagDes = await Tags.create({
      name: name,
      description: description,
    });
    return res.json({
      succes: false,
      message: "Tag created succesfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      messsge: error,
    });
  }
};
exports.showAlltags = async (req, res) => {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
  } catch (error) {
    return res.json({
      success: false,
      messsge: error,
    });
  }
};
