const mongoose = require("mongoose");
const Subcategory = require("./subcategory.model");
const createError = require("http-errors");

exports.postSubcat = (req, res, next) => {
  const subcategory = new Subcategory({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
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
    const categories = await Subcategory.find({}).select('-__v -createdAt -updatedAt');
    // if (categories.length === 0)
    //   return next(new MyError(400, "no topics found"));
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: categories
      });
  } catch (error) {
    next(error);
  }
};