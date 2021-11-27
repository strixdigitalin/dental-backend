const Test = require("./test_result.model");
const mongoose = require('mongoose');
const createError = require("http-errors");
const questionModel = require("../question/question.model");
const ObjectId = mongoose.Types.ObjectId;
const Subject = require("../subjects/subject.model");
const Profile = require("../profile/profile.model");
const topicModel = require("../topics/topics.model");

exports.createTestResult = (req, res, next) => {
  const testResult = new Test({
    _id: new mongoose.Types.ObjectId(),
    test_name: req.body.test_name,
    mode: req.body.mode,
    user: req.user.id,
    questions_details: req.body.questions_details,
    totalQuestion: req.body.totalQuestion,
    totalIncorrect: req.body.totalIncorrect,
    totalCorrect: req.body.totalCorrect,
    totalUnanswered: req.body.totalUnanswered,
    totalMarked: req.body.totalMarked,
    totalTimeSpend: req.body.totalTimeSpend,
    totalScore: parseInt(req.body.totalCorrect) / parseInt(req.body.totalQuestion) * 100
  })
  testResult.save()
    .then(async (data) => {
      const testResults = await Test.findOne({ _id: data.id })
        .populate(
          {
            path: 'questions_details.question',
            populate: {
              path: 'subject topic subtopic',
              select: 'title'
            }
          }
        )
      var questions_details = []
      questions_details = req.body.questions_details
      console.log(questions_details)
      const profiles = await Profile.findOne({ user: req.user.id })
      questions_details.map(async (ques) => {
        var exist = profiles.question_details.find(x => x.question == ques.question)
        console.log(exist)
        if (!exist) {
          await Profile.findByIdAndUpdate({ _id: profiles._id }, { $push: { "question_details": ques } })
        }
      })
      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: testResults
      });
    }).catch(err => { next(err) });
};


exports.getAllTestResultsUser = async (req, res, next) => {
  try {
    const testResults = await Test.aggregate([
      {
        $match: {
          user: ObjectId(req.user.id),
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          questions_details: 0,
          user: 0,
          __v: 0
        }
      }
    ])

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
    const testResults = await Test.findOne({ $and: [{ user: req.user.id }, { _id: req.params.id }] })
      .populate(
        {
          path: 'questions_details.question',
          populate: {
            path: 'subject topic subtopic',
            select: 'title'
          }
        }
      )



    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: testResults,
    });
  } catch (error) {
    next(error);
  }
};


exports.topicPerfomance = async (req, res, next) => {
  var topic_performance = []
  // const results = await Subject.aggregate([
  //   {
  //     $lookup: {
  //       from: "topics",
  //       localField: "_id",
  //       foreignField: "subject",
  //       as: "topics",
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$topics",
  //       preserveNullAndEmptyArrays: false,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "subtopics",
  //       localField: "topics._id",
  //       foreignField: "topic",
  //       as: "topics.subTopics",
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$_id",
  //       title: { $first: "$title" },
  //       createdAt: { $first: "$createdAt" },
  //       updatedAt: { $first: "$updatedAt" },
  //       topics: { $push: "$topics" },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       id: "$_id",
  //       title: 1,
  //       createdAt: 1,
  //       updatedAt: 1,
  //       topics: {
  //         $map: {
  //           input: "$topics",
  //           as: "topics",
  //           in: {
  //             id: "$$topics._id",
  //             title: "$$topics.title",
  //             subTopics: {
  //               $map: {
  //                 input: "$$topics.subTopics",
  //                 as: "subTopics",
  //                 in: {
  //                   id: "$$subTopics._id",
  //                   title: "$$subTopics.title",
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },

  // ]);
  var allSubjects = await Subject.find({}).limit(3)
  var profile = await Profile.findOne({ user: req.user.id })
  var profile_questions = profile.question_details
  var alltopic = []
  for (let index = 0; index < allSubjects.length; index++) {
    var count = await questionModel.countDocuments({ subject: allSubjects[index].id })
    var result = await questionModel.find({ subject: allSubjects[index].id }).populate('topic')
    var allquestion = result.map((detail) => detail.id)
    var profilequesid = profile_questions.map((data) => data.question)
    var used_count = allquestion.filter((detail) => profilequesid.includes(detail))
    topic_performance.push(createObject(allSubjects[index].title, allSubjects[index].id, { 'used_counts': used_count.length, 'total_counts': count }, alltopic))
  }

  // allSubjects.map((subject) => {
  //   topic_performance.push(createObject(subject.title, subject.id, findQuesCountInSubject(profile_questions, subject, allQuestions), findTopicsInSubject(profile_questions, subject, allQuestions)))
  // })
  res.status(200).json({
    success: true,
    message: "success",
    data: topic_performance,
  });
}
function findTopicsInSubject(profile_questions, subject, question) {
  var count = 0
  var usedcount = 0
  var totalUnanswered = 0
  var totalCorrect = 0
  var totalIncorrect = 0
  var topic = []
  for (let index = 0; index < question.length; index++) {
    if (question[index].topic.subject == subject.id) {
      count++
      for (let j = 0; j < profile_questions.length; j++) {
        if (profile_questions[j].question == question[index].id) {
          usedcount++
          if (profile_questions[j].isUnanswered) {
            totalUnanswered++
          }
          if (profile_questions[j].isIncorrect) {
            totalIncorrect++
          }
          if (profile_questions[j].isCorrect) {
            totalCorrect++
          }
        }

      }
      topic.push({
        id: question[index].topic.id,
        topic_name: question[index].topic.title, usage: {
          used_count: usedcount.toString(), total_count: count.toString(), omitted: totalUnanswered, totalIncorrect: totalIncorrect, totalCorrect
        }
      })
    }
  }

  return topic
}
function getduplicatetopic(topics, singletopic) {
  for (let index = 0; index < topics.length; index++) {
    if (topics[index].id == singletopic.id) {
      return false
    }
  }
  return true
}
function findQuesCountInSubject(profile_questions, subject, question) {
  var count = 0
  var usedcount = 0
  var totalUnanswered = 0
  var totalCorrect = 0
  var totalIncorrect = 0
  for (let index = 0; index < question.length; index++) {
    if (question[index].subject.id == subject.id) {
      count++
      for (let j = 0; j < profile_questions.length; j++) {
        if (profile_questions[j].question == question[index].id) {
          usedcount++
          if (profile_questions[j].isUnanswered) {
            totalUnanswered++
          }
          if (profile_questions[j].isIncorrect) {
            totalIncorrect++
          }
          if (profile_questions[j].isCorrect) {
            totalCorrect++
          }
        }
      }
    }
  }
  return { used_count: usedcount.toString(), total_count: count.toString(), omitted: totalUnanswered, totalIncorrect: totalIncorrect, totalCorrect }
}

function createObject(subjectName, id, usage, topic) {
  return {
    "id": id,
    "subject_name": subjectName,
    "usage": usage,
    "topic": topic
  }
}