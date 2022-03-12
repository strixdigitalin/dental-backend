const mongoose = require("mongoose");
const createError = require("http-errors");
const questionModel = require("../question/question.model");
const ObjectId = mongoose.Types.ObjectId;
const Subject = require("../subjects/subject.model");
const Profile = require("../profile/profile.model");
const topicModel = require("../topics/topics.model");
const async = require("async");
const test_resultModel = require("../test_results/test_result.model");

exports.getUsedInfo = async (req, res, next) => {
  async.parallel(
    [
      function (callback) {
        questionModel.countDocuments({}, (err, count) => {
          callback(err, count);
        });
      },
      function (callback) {
        Profile.findOne({ user: req.params.id })
          .populate("user")
          .exec((err, result) => {
            var total_correct = 0;
            var total_incorrect = 0;
            result.question_details.forEach((element) => {
              if (element.isCorrect) {
                total_correct++;
              }
              if (element.isIncorrect) {
                total_incorrect++;
              }
            });
            callback(err, {
              user_detail: {
                name: result.user.firstName + " " + result.user.lastName,
              },
              used: result.question_details.length,
              total_correct: total_correct,
              total_incorrect: total_incorrect,
            });
          });
      },
      function (callback) {
        test_resultModel.find({ user: req.params.id }).exec((err, result) => {
          callback(err, result.length);
        });
      },
    ],
    function (err, result) {
      if (err) return next(err);
      const [question, used_question, test] = result;
      let question_detail = {
        count: question,
        used: used_question.used,
        unused: question - used_question.used,
        total_correct: used_question.total_correct,
        total_incorrect: used_question.total_incorrect,
      };
      let test_detail = {
        test_created: test,
        test_completed: test,
      };
      let response = {
        user_detail: used_question.user_detail,
        question_detail,
        test_detail,
      };
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: response,
      });
    }
  );
};
