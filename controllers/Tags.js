const Tags = require("../models/Tags");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.json({
        success: false,
        message: "Fill all required field",
      });
    }

    const tagDetails = await Tags.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    return res.status(200).json({
      success: true,
      message: "Tag created succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Tag creation failed",
    });
  }
};
exports.showAlltags = async (req, res) => {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "Got all available tags",
      tags: allTags,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in finding tags",
    });
  }
};
