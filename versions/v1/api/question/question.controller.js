const Question = require("./question.model");
const FunctionalKnowledge = require("../functional_knowledge/category.model");
const Topics = require("../topics/subcategory.model");
const MyError = require("../../error/MyError");
const async = require('async');
const mongoose = require("mongoose");
const createHttpError = require("http-errors");

exports.createQuestion = async (req, res, next) => {
  try {
    const question = new Question({
      _id: new mongoose.Types.ObjectId(),
      functionalKnowledge: req.body.functionalKnowledge,
      topics: req.body.topics,
      questionTitle: req.body.questionTitle,
      options: req.body.options,
      users: []
    })
    const topics = await Topics.updateOne({ _id: req.body.topics }, { $inc: { questionsCount: 1 } });
    const functionalKnowledge = await FunctionalKnowledge.updateOne({ _id: req.body.functionalKnowledge }, { $inc: { questionsCount: 1 } });
    question.save().then(data => {
      res.status(200).json({ statusCode: 200, message: "success", question });
    })
  } catch (error) {
    next(error);
  }
};

exports.getAllQuestions = async (req, res, next) => {
  let perPage = 1;
  const page = req.query.page - 1;
  let query = req.body;
  console.log(query)
  let mysort;
  let totalquestions;
  async.parallel([
    function (callback) {
      Question.countDocuments({ $or: query }, (err, count) => {
        let totalquestions = count;
        console.log(totalquestions)
        callback(err, totalquestions);
      });
    },
    function (callback) {
      Question.find({ $or: query }).sort(mysort).limit(parseInt(req.query.limit))
        .skip(perPage * page)
        .limit(perPage).select('-functionalKnowledge -topics -createdAt -updatedAt -__v')
        .exec((err, questions) => {
          if (err) return next(err);
          console.log(questions)
          callback(err, questions);
        });
    }
  ], function (err, result) {
    console.log(err)
    if (err) return next(err);
    if (req.query.limit) {
      totalquestions = parseInt(req.query.limit)
    } else {
      totalquestions = result[0];
    }
    let questions = result[1];
    let pages = Math.ceil(totalquestions / perPage);
    res.status(200).json({
      statusCode: 200,
      message: "success",
      parameters: req.body,
      data: questions,
      totalquestions: totalquestions,
      currentpage: page + 1,
      pages: pages
    });
  });
};

exports.addQuestionToCategory = async (req, res, next) => {
  try {
    let user = {
      user: req.user.id,
      isUnused: req.body.isUnused,
      isMarked: req.body.isMarked,
      isIncorrect: req.body.isIncorrect,
      isCorrect: req.body.isCorrect
    }
    const questions = await Question.findById(req.params.id);
    if (!questions) {
      next(createHttpError.NotFound('No Question'))
    }
    console.log(questions.users)
    questions.users.push(user);
    let questionpush = await questions.save();
    res.status(200).json({
      message: "success",
      data: questionpush
    })
  } catch (error) {
    next(error);
  }
};
