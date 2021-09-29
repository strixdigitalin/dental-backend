const Question = require("../../api/question/question.model");
const Test = require("./test.model");
const TestResult = require("../../api/test_results/test_result.model");
const mongoose = require('mongoose');
const createError = require("http-errors");

exports.createTest = async (req, res, next) => {
  let total_score = parseInt(req.body.correct_ans) / parseInt(req.body.totalquestion) * 100
  const testResult = new TestResult({
    _id: new mongoose.Types.ObjectId(),
    correct_ans : req.body.correct_ans,
    incorrect_ans : req.body.incorrect_ans,
    unanswered : req.body.unanswered,
    totalquestion : req.body.totalquestion,
    score : total_score
  }) 
  testResult.save()
    .then((data) => {
      console.log(testResult._id)
      console.log(req.user)
      const test = new Test({
        _id : new mongoose.Types.ObjectId(),
        test_name : req.body.test_name,
        mode : req.body.mode,
        test_results : [
          testResult._id
        ],
        user : req.user.id,
        total_score : total_score,
        totalQuestions : req.body.totalquestion
      })

      test.save().then(data =>{
        res.status(200).json({
          statusCode : 200,
          message : "success",
          data : data
        })
      });
    }).catch(err => { next(err) });
  
 
};


exports.getAllTestUser = async (req, res, next) => {
  try {
    const test = await Test.find({user : req.user.id}).populate('test_results' , '-__v').select('-__v -createdAt -updatedAt');
  
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: test
      });
  } catch (error) {
    next(error);
  }
};

exports.getAllAnswersCount = async (req,res,next) =>{
  try {
    const test = await Test.find({user : req.user.id}).populate('test_results' , '-__v').select('-__v -createdAt -updatedAt');
  
    console.log(test[0].test_results)
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: {
          totalQuestions : test[0].totalQuestions,
          totalTests : test[0].test_results.length
        }
      });
  } catch (error) {
    next(error);
  }
}
