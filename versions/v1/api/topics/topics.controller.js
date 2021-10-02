const mongoose = require("mongoose");
const Topics = require("./topics.model");
const createError = require("http-errors");

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
        statusCode: 201,
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
      statusCode: 200,
      message: "success",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
