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
    async.parallel([

        function (callback) {
            questionModel.countDocuments({}, (err, count) => {
                callback(err, count)
            })

        },
        function (callback) {
            Profile.findOne({ user: req.user.id }).exec((err, result) => {
                callback(err, result.question_details.length)
            })
        },
        function (callback) {
            test_resultModel.find({ user: req.user.id }).exec((err, result) => {
                callback(err, result.length)
            })
        }
    ], function (err, result) {
        if (err) return next(err);
        const [question, used_question, test] = result
        let question_detail = {
            count: question,
            used: used_question,
            unused: question - used_question
        }
        let test_detail = {
            test_created: test,
            test_completed: test
        }
        let response = {
            question_detail,
            test_detail
        }
        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: response,
        });
    })
}