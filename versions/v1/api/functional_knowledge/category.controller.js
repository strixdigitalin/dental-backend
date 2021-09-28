const Category = require("./category.model");
const MyError = require("../../error/MyError");
const Question = require("../question/question.model");
const mongoose = require('mongoose');
exports.getAllCategory = async (req, res, next) => {
  try {
    const questions = await Question.find({});
    console.log(questions) 
    const categories = await Category.find({}).populate('topics' , '-__v').select('-__v -createdAt -updatedAt');
    if (categories.length === 0)
      return next(new MyError(400, "no categories found"));
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: categories
      });
  } catch (error) {
    next(error);
  }
};

exports.getCatValues = async (req,res,next) => {
  try {
    const questions = await Question.find({});
    console.log(questions) 
    const categories = await Category.find({}).populate('topics' , '-__v').select('-__v -createdAt -updatedAt');
   
  } catch (error) {
    next(error);
  }
}

exports.createCategory = (req, res, next) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    topics: req.body.topics
  })
  category.save()
    .then((data) => {
      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: data
      });
    }).catch(err => { next(err) });
};
