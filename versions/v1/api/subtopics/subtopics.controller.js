const mongoose = require("mongoose");
const SubTopic = require("./subtopics.model");

exports.postSubtopic = (req, res, next) => {
  const subcategory = new SubTopic({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    topic: req.body.topic,
  });
  subcategory
    .save()
    .then((data) => {
      res.status(201).json({
        success : true,
        message: "Created Successfully",
        data: data,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllSubTopics = async (req, res, next) => {
  try {
    const categories = await SubTopic.find({});

    res.status(200).json({
      success : true,
      message: "success",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
