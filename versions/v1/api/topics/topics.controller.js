const mongoose = require("mongoose");
const Topics = require("./topics.model");

exports.postTopics = (req, res, next) => {
  const subcategory = new Topics({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    subject: req.body.subject,
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

exports.getAllTopics = async (req, res, next) => {
  try {
    const categories = await Topics.find({});

    res.status(200).json({
      success : true,
      message: "success",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
