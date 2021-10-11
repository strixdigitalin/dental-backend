const Question = require("./question.model");
const MyError = require("../../error/MyError");
const async = require("async");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const Test = require("../test_results/test_result.model");

exports.createQuestion = async (req, res, next) => {
  const question = new Question({
    subject: req.body.subject,
    topic: req.body.topic,
    subtopic: req.body.subtopic,
    questionType: req.body.questionType,
    questionTitle: req.body.questionTitle,
    options: req.body.options,
    explaination: req.body.explaination,
  });
  question
    .save()
    .then((data) => {
      res
        .status(200)
        .json({ statusCode: 200, success: true, message: "success", question });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllQuestions = async (req, res, next) => {
  try {
    if (
      req.query.subTopicId &&
      !mongoose.Types.ObjectId.isValid(req.query.subTopicId)
    )
      throw new MyError(400, "Not a valid Subject Id.");

    const subTopicId = req.query.subTopicId;

    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 50;
    const search = req.query.search || "";
    const subjectId = req.query.subjectId;
    const topicId = req.query.topicId;
    const findBy = {
      questionTitle: { $regex: search, $options: "i" },
    };
    if (subTopicId) findBy.subtopic = subTopicId;
    if(subjectId) findBy.subject = subjectId;
    if(topicId) findBy.topic = topicId;
console.log(findBy)
    const [questions, count] = await Promise.all([
      Question.find(findBy)
        .sort({ _id: 1 })
        .skip(limit * (page - 1))
        .limit(limit),
      Question.countDocuments(findBy),
    ]);

    res.status(200).json({
      success: true,
      message: "success",
      count,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

exports.addQuestionToCategory = async (req, res, next) => {
  try {
    let user = {
      user: req.user.id,
      isUnused: req.body.isUnused,
      isMarked: req.body.isMarked,
      isIncorrect: req.body.isIncorrect,
      isCorrect: req.body.isCorrect,
    };
    const questions = await Question.findById(req.params.id);
    if (!questions) {
      next(createHttpError.NotFound("No Question"));
    }
    console.log(questions.users);
    questions.users.push(user);
    let questionpush = await questions.save();
    res.status(200).json({
      message: "success",
      data: questionpush,
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const test = await Test.find({ _id: req.params.id })
      .populate("functionalKnowledge topics", "title")
      .select("-__v -functionalKnowledge.topics");
    let questionId = req.query.questionId;
    let question = test[0].questions_details.find((x) => x.id === questionId);
    const questions = await Question.find({ _id: question.question });
    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: {
        user_action: question,
        question_detail: questions,
      },
    });
  } catch (error) {
    next(error);
  }
};
