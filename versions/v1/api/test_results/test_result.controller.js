const Test = require("./test_result.model");
const mongoose = require('mongoose');
const createError = require("http-errors");





exports.createTestResult = (req, res, next) => {
  const testResult = new Test({
    _id: new mongoose.Types.ObjectId(),
    test_name: req.body.test_name,
    mode: req.body.mode,
    user: req.user.id,
    questions_details: req.body.questions_details,
    correct_ans: req.body.correct_ans,
    incorrect_ans: req.body.incorrect_ans,
    unanswered: req.body.unanswered,
    totalquestion: req.body.totalquestion,
    totalscore: parseInt(req.body.correct_ans) / parseInt(req.body.totalquestion) * 100
  })
  testResult.save()
    .then((data) => {
      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: data
      });
    }).catch(err => { next(err) });
};


exports.getAllTestResultsUser = async (req, res, next) => {
  try {
    const testResults = await Test.find({ user: req.user.id })
      .populate({
        path: "questions_details.question ",
        select: "-__v",
        populate: {
          path: "functionalKnowledge topics",
          select: "title",
          populate: { path: "subtopics", select: "title" },
        },
      })
      .select("-__v");

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: testResults,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTestResultsById = async (req, res, next) => {
  try {
    const testResults = await Test.findOne({ _id: req.params.id })
      .populate({
        path: "questions_details.question ",
        select: "-__v",
        populate: {
          path: "functionalKnowledge topics",
          select: "title",
          populate: { path: "subtopics", select: "title" },
        },
      })
      .select("-__v");

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: testResults,
    });
  } catch (error) {
    next(error);
  }
};
