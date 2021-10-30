const Question = require("./question.model");
const MyError = require("../../error/MyError");
const async = require("async");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const Test = require("../test_results/test_result.model");
const { result } = require("lodash");
const ObjectId = mongoose.Types.ObjectId;
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

exports.getAllQuestionsUser = async (req, res, next) => {
  try {
    console.log(req.query)
    let results;
    let filterBy = req.query.filterBy;
    const subTopicId = req.query.subTopicId;
    let filter;
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 50;
    if (req.query.filterBy != "all") {
     if(filterBy == "isIncorrect"){
      filter = {
        isIncorrect : true
       }
     } 
     if(filterBy == "isMarked"){
      filter = {
        isMarked : true
       }
     }

     if(filterBy == "")
       
      results = await Test.aggregate([
        {
          $match: {
            user: ObjectId(req.user.id),
          },
        },
        { $unwind: "$questions_details" },
        { $replaceRoot: { newRoot: "$questions_details" } },
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "questions",
            localField: "question",
            foreignField: "_id",
            as: "question",
          },
        },
        { $unwind: "$question" },
        { $replaceRoot: { newRoot: "$question" } },
        {
          $project: {
            __v: 0
          }
        },
        {$skip: limit * (page - 1)},
        {$limit: limit}
      ])
    }
    res.status(200).json({
      success: true,
      message: "success",
      data: results,
    });




  } catch (error) {
    next(error);
  }
}

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
    if (subjectId) findBy.subject = subjectId;
    if (topicId) findBy.topic = topicId;
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
exports.getCategory = async (req, res, next) => {
  console.log(req.query);
  let result;
  try {
    if (Object.keys(req.query).length === 0) {
      result = await Question.aggregate([
        {
          $group: {
            _id: {
              subject: "$subject",
              topic: "$topic",
            },
            subtopic: {
              $addToSet: "$subtopic",
            },
          },
        },
        {
          $group: {
            _id: "$_id.subject",
            topics: {
              $push: {
                topic: "$_id.topic",
                sub: "$subtopic",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            subject: "$_id",
            topics: 1,
          },
        },
      ]);
    } else {
      let findBy = { "questions.isCorrect": true };
      result = await Test.aggregate([
        { $unwind: "$questions" },
        // {
        //   $lookup: {
        //     from: "questions",
        //     localField: "questions.questionId",
        //     foreignField: "_id",
        //     as: "questions.newQuestions",
        //   },
        // },
        // { $unwind: "$questions.newQuestions" },
        // {
        //   $group: {
        //     _id: "$_id",
        //     root: { $mergeObjects: "$$ROOT" },
        //     questions: { $push: "$questions" },
        //   },
        // },
        // {
        //   $replaceRoot: {
        //     newRoot: {
        //       $mergeObjects: ["$root", "$$ROOT"],
        //     },
        //   },
        // },
        // {
        //   $project: {
        //     root: 0,
        //   },
        // },
        // { $unwind: "$questions" },
        // {
        //   $project: {
        //     _id: 1,
        //     test_name: 1,
        //     questions: 1,
        //     newQuestions: "$questions.newQuestions",
        //   },
        // },
        // // important
        // { $match: findBy },
        // {
        //   $group: {
        //     _id: {
        //       subject: "$newQuestions.subject",
        //       topic: "$newQuestions.topic",
        //     },
        //     subtopic: {
        //       $addToSet: "$newQuestions.subtopic",
        //     },
        //   },
        // },
        // {
        //   $group: {
        //     _id: "$_id.subject",
        //     topics: {
        //       $push: {
        //         topic: "$_id.topic",
        //         sub: "$subtopic",
        //       },
        //     },
        //   },
        // },
        // {
        //   $project: {
        //     _id: 0,
        //     subject: "$_id",
        //     topics: 1,
        //   },
        // },
      ]);
    }
    console.log(result)
    res.status(200).json(result);
  } catch (error) {
    console.log(error)
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
