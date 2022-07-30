const Question = require("./question.model");
const MyError = require("../../error/MyError");
const async = require("async");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const Test = require("../test_results/test_result.model");
const { result } = require("lodash");
const subjectModel = require("../subjects/subject.model");
const topicsModel = require("../topics/topics.model");
const subtopicsModel = require("../subtopics/subtopics.model");
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
      console.log(data);
      subjectModel
        .updateOne({ _id: data.subject }, { $inc: { questionCount: 1 } })
        .then((d) => { });
      topicsModel
        .updateOne({ _id: data.topic }, { $inc: { questionCount: 1 } })
        .then((d) => { });
      subtopicsModel
        .updateOne({ _id: data.subtopic }, { $inc: { questionCount: 1 } })
        .then((d) => { });
      res
        .status(200)
        .json({ statusCode: 200, success: true, message: "success", question });
    })
    .catch((err) => {
      next(err);
    });
};






exports.getTestExists = async (req, res, next) => {
  try {
    const TestExist = await Test.countDocuments({ user: req.user.id });
    if (TestExist > 0) {
      res.status(200).json({
        message: "success",
        exists: true,
      });
    } else {
      res.status(200).json({
        message: "success",
        exists: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllQuestionsUser = async (req, res, next) => {
  try {
    let results;
    let filterBy = req.body.filterBy;
    let subtopic = req.body.subTopicId;
    let newArrSubTopic = [];
    for (let index = 0; index < subtopic.length; index++) {
      const element = subtopic[index];
      element.toString();
      let obj = { subtopic: ObjectId(element) };
      newArrSubTopic.push(obj);
    }
    const page = req.query.page || 1;
    const noOfQuestions = req.query.limit * 1 || 50;
    const limit = 1 * 1 || 50;
    let count;

    if (req.query.filterBy != "all") {
      let cond = [
        {
          $match: {
            user: ObjectId(req.user.id),
          },
        },
        { $unwind: "$questions_details" },
        { $replaceRoot: { newRoot: "$questions_details" } },
        {
          $project: {
            question: 1,
            isMarked: 1,
            isCorrect: 1,
            isIncorrect: 1,
            timeSpend: 1,
          },
        },
        {
          $match: {
            $or: filterBy,
          },
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
          $match: {
            $or: newArrSubTopic,
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
        {
          $group: {
            _id: "$_id",
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "_id",
            as: "question",
          },
        },
        { $unwind: "$question" },
        { $replaceRoot: { newRoot: "$question" } },
        { $skip: limit * (page - 1) },
        { $limit: 1 },
      ];
      results = await Test.aggregate(cond);
      cond.pop();
      cond.pop();
      count = await Test.aggregate(cond);
      count = count.length;
      res.status(200).json({
        success: true,
        message: "success",
        count,
        pageCount: parseInt(noOfQuestions),
        data: results,
      });
    } else {

      // let newquery = {};
      // newquery["subtopic"] = {
      //   "or$": req.body.subTopicId
      // }

      // let cond = [
      //   {
      //     $match: {
      //       $or: newArrSubTopic,
      //     },
      //   },
      //   {
      //     $project: {
      //       __v: 0,
      //     },
      //   },
      //   { $skip: limit * (page - 1) },
      //   { $limit: 1 },
      // ];
      const newcount = await Question.countDocuments({ $or: newArrSubTopic })
        .skip(noOfQuestions * (page - 1))
        .limit(noOfQuestions)
      results = await Question.find({ $or: newArrSubTopic })
        .skip(noOfQuestions * (page - 1))
        .limit(noOfQuestions);
      // cond.pop();
      // cond.pop();
      // count = results.length;
      res.status(200).json({
        success: true,
        message: "success",
        count: newcount,
        pageCount: Math.ceil(newcount / noOfQuestions),
        data: results,
      });
    }
  } catch (error) {
    next(error);
  }
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
    if (subjectId) findBy.subject = subjectId;
    if (topicId) findBy.topic = topicId;
    console.log(findBy);
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
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
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
    const test = await Test.find({ _id: req.params.id });

    let questionId = req.query.questionId;
    let question = test[0].questions_details.find((x) => x.id === questionId);
    console.log(question);
    const questions = await Question.find({ _id: question.question }).populate(
      "subject topic subtopic",
      "title"
    );
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

exports.update = async (req, res, next) => {
  const body = req.body || {};
  const id = req.params.id;
  try {
    if (!id) throw createHttpError.NotFound("Id Is Required");
    if (Object.keys(body).length == 0)
      throw createHttpError.NotAcceptable("Body Is Empty");
    var exist = await Question.findOne({ _id: id });
    if (!exist) throw createHttpError.NotFound("NOT FOUND");
    Question.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { returnOriginal: false },
      (err, doc) => {
        if (err) throw createHttpError.NotFound("NOT FOUND");
        res.status(200).json({
          message: "Update Successfully",
          data: doc,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.delById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) throw createHttpError.NotFound("NO DATA FOUND");
    const deletedQuestion = await Question.findByIdAndRemove(req.params.id);

    res.status(200).json({
      statusCode: 200,
      message: "Deleted Successfully",
      data: deletedQuestion,
    });
  } catch (err) {
    next(err);
  }
};
