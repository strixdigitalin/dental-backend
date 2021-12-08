const Test = require("./test_result.model");
const mongoose = require("mongoose");
const createError = require("http-errors");
const questionModel = require("../question/question.model");
const ObjectId = mongoose.Types.ObjectId;
const Subject = require("../subjects/subject.model");
const Profile = require("../profile/profile.model");
const topicModel = require("../topics/topics.model");
const async = require("async");
const subtopicsModel = require("../subtopics/subtopics.model");
var differenceBy = require("lodash.differenceby");

exports.createTestResult = (req, res, next) => {
  const testResult = new Test({
    _id: new mongoose.Types.ObjectId(),
    test_name: req.body.test_name,
    mode: req.body.mode,
    user: req.user.id,
    subjects: req.body.subjectId,
    subTopics: req.body.subTopicId,
    topics: req.body.topicId,
    questions_details: req.body.questions_details,
    totalQuestion: req.body.totalQuestion,
    totalIncorrect: req.body.totalIncorrect,
    totalCorrect: req.body.totalCorrect,
    totalUnanswered: req.body.totalUnanswered,
    totalMarked: req.body.totalMarked,
    totalTimeSpend: req.body.totalTimeSpend,
    totalScore:
      (parseInt(req.body.totalCorrect) / parseInt(req.body.totalQuestion)) *
      100,
  });
  testResult
    .save()
    .then(async (data) => {
      const testResults = await Test.findOne({ _id: data.id }).populate({
        path: "questions_details.question",
        populate: {
          path: "subject topic subtopic",
          select: "title",
        },
      });
      var questions_details = [];
      questions_details = req.body.questions_details;
      // console.log(questions_details);
      const profiles = await Profile.findOne({ user: req.user.id });
      questions_details.map(async (ques) => {
        var exist = profiles.question_details.find(
          (x) => x.question == ques.question
        );
        // console.log(exist);
        if (!exist) {
          await Profile.findByIdAndUpdate(
            { _id: profiles._id },
            { $push: { question_details: ques } }
          );
        }
        ques["userId"] = req.user.id;
        // console.log(ques);
      });
      // console.log(questions_details);

      //subject
      let subject = req.body.subjectId;
      subject.map(async (subject) => {
        // console.log(subject);
        questions_details.map((question) => {
          questionModel.findById(question.question).then((data) => {
            // console.log(data);
            Subject.findByIdAndUpdate(
              { _id: ObjectId(data.subject) },
              {
                $pull: {
                  user: {
                    $and: [
                      { userId: req.user.id },
                      { question: question.question },
                    ],
                  },
                },
              }
            ).then((result) => {});
            Subject.findByIdAndUpdate(
              { _id: ObjectId(data.subject) },
              { $push: { user: question } }
            ).then((result) => {});
          });
        });
      });

      //topic
      // let topic = req.body.topicId;
      // topic.map(async (topic) => {
      //   console.log(topic);
      //   topicModel.find({ _id: topic }).then((result) => {
      //     // console.log(result[0]);
      //     let data = result[0];
      //     if (data.user.length > 0) {
      //       questions_details.map((questions) => {
      //         topicModel
      //           .findByIdAndUpdate(
      //             { _id: topic },
      //             {
      //               $pull: {
      //                 user: {
      //                   $and: [
      //                     { userId: questions.userId },
      //                     { question: questions.question },
      //                   ],
      //                 },
      //               },
      //             }
      //           )
      //           .then((result) => {});
      //       });
      //     }
      //   });
      //   topicModel
      //     .findByIdAndUpdate(
      //       { _id: topic },
      //       { $push: { user: questions_details } }
      //     )
      //     .then((result) => {});
      // });

      //subtopic
      // let subtopic = req.body.subTopicId;
      // subtopic.map(async (subtopic) => {
      //   console.log(subtopic);
      //   subtopicsModel.find({ _id: subtopic }).then((result) => {
      //     // console.log(result[0]);
      //     let data = result[0];
      //     if (data.user.length > 0) {
      //       questions_details.map((questions) => {
      //         subtopicsModel
      //           .findByIdAndUpdate(
      //             { _id: subtopic },
      //             {
      //               $pull: {
      //                 user: {
      //                   $and: [
      //                     { userId: questions.userId },
      //                     { question: questions.question },
      //                   ],
      //                 },
      //               },
      //             }
      //           )
      //           .then((result) => {});
      //       });
      //     }
      //   });
      //   subtopicsModel
      //     .findByIdAndUpdate(
      //       { _id: subtopic },
      //       { $push: { user: questions_details } }
      //     )
      //     .then((result) => {});
      // });

      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: testResults,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllTestResultsUser = async (req, res, next) => {
  try {
    const testResults = await Test.aggregate([
      {
        $match: {
          user: ObjectId(req.user.id),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          questions_details: 0,
          user: 0,
          __v: 0,
        },
      },
    ]);

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
    const testResults = await Test.findOne({
      $and: [{ user: req.user.id }, { _id: req.params.id }],
    }).populate({
      path: "questions_details.question",
      populate: {
        path: "subject topic subtopic",
        select: "title",
      },
    });

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
  try {
    async.parallel(
      [
        function (callback) {
          Subject.aggregate([
            {
              $lookup: {
                from: "topics",
                localField: "_id",
                foreignField: "subject",
                as: "topics",
              },
            },
            {
              $unwind: {
                path: "$topics",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $lookup: {
                from: "subtopics",
                localField: "topics._id",
                foreignField: "topic",
                as: "topics.subTopics",
              },
            },
            {
              $group: {
                _id: "$_id",
                title: { $first: "$title" },
                user: { $first: "$user" },
                questionCount: { $first: "$questionCount" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                topics: { $push: "$topics" },
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                title: 1,
                user: 1,
                questionCount: 1,
                createdAt: 1,
                updatedAt: 1,
                topics: {
                  $map: {
                    input: "$topics",
                    as: "topics",
                    in: {
                      id: "$$topics._id",
                      title: "$$topics.title",
                      questionCount: "$$topics.questionCount",
                      user: "$$topics.user",
                      subTopics: {
                        $map: {
                          input: "$$topics.subTopics",
                          as: "subTopics",
                          in: {
                            id: "$$subTopics._id",
                            title: "$$subTopics.title",
                            questionCount: "$$subTopics.questionCount",
                            user: "$$subTopics.user",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            { $sort: { questionCount: -1 } },
          ]).exec((err, subjects) => {
            // console.log(subjects);
            const newData = subjects.map((subject) => {
              let isIncorrect = 0;
              let isCorrect = 0;
              let isUnanswered = 0;
              let count = 0;
              // console.log(subject);
              subject.user.forEach((user) => {
                // console.log(user);
                count++;
                if (user.isIncorrect) {
                  isIncorrect++;
                }
                if (user.isCorrect) {
                  isCorrect++;
                }
                if (user.isUnanswered) {
                  isUnanswered++;
                }
              });

              const topics = subject.topics.map((topic) => {
                let isIncorrect = 0;
                let isCorrect = 0;
                let isUnanswered = 0;
                let count = 0;
                console.log(topic);
                topic.user.forEach((user) => {
                  // console.log(user);
                  count++;
                  if (user.isIncorrect) {
                    isIncorrect++;
                  }
                  if (user.isCorrect) {
                    isCorrect++;
                  }
                  if (user.isUnanswered) {
                    isUnanswered++;
                  }
                });
                const subTopic = topic.subTopics.map((subtopic) => {
                  let isIncorrect = 0;
                  let isCorrect = 0;
                  let isUnanswered = 0;
                  let count = 0;
                  console.log(topic);
                  subtopic.user.forEach((user) => {
                    // console.log(user);
                    count++;
                    if (user.isIncorrect) {
                      isIncorrect++;
                    }
                    if (user.isCorrect) {
                      isCorrect++;
                    }
                    if (user.isUnanswered) {
                      isUnanswered++;
                    }
                  });
                  return {
                    _id: subtopic.id,
                    title: subtopic.title,
                    totalQuestion: topic.questionCount,
                    isIncorrect,
                    isCorrect,
                    isUnanswered,
                    count,
                  };
                });
                return {
                  _id: topic.id,
                  title: topic.title,
                  subTopics: subTopic,
                  totalQuestion: topic.questionCount,
                  isIncorrect,
                  isCorrect,
                  isUnanswered,
                  count,
                };
              });
              return {
                subject: {
                  _id: subject.id,
                  title: subject.title,
                  totalQuestion: subject.questionCount,
                  topics: topics,
                  isIncorrect,
                  isCorrect,
                  isUnanswered,
                  count,
                },
              };
            });
            callback(err, newData);
          });
        },
      ],
      function (err, result) {
        console.log(err);
        if (err) return next(err);
        let subjects = result[0];

        res.status(200).json({
          statusCode: 200,
          message: "success",
          data: subjects,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

function findTopicsInSubject(profile_questions, subject, question) {
  var count = 0;
  var usedcount = 0;
  var totalUnanswered = 0;
  var totalCorrect = 0;
  var totalIncorrect = 0;
  var topic = [];
  for (let index = 0; index < question.length; index++) {
    if (question[index].topic.subject == subject.id) {
      count++;
      for (let j = 0; j < profile_questions.length; j++) {
        if (profile_questions[j].question == question[index].id) {
          usedcount++;
          if (profile_questions[j].isUnanswered) {
            totalUnanswered++;
          }
          if (profile_questions[j].isIncorrect) {
            totalIncorrect++;
          }
          if (profile_questions[j].isCorrect) {
            totalCorrect++;
          }
        }
      }
      topic.push({
        id: question[index].topic.id,
        topic_name: question[index].topic.title,
        usage: {
          used_count: usedcount.toString(),
          total_count: count.toString(),
          omitted: totalUnanswered,
          totalIncorrect: totalIncorrect,
          totalCorrect,
        },
      });
    }
  }

  return topic;
}
function getduplicatetopic(topics, singletopic) {
  for (let index = 0; index < topics.length; index++) {
    if (topics[index].id == singletopic.id) {
      return false;
    }
  }
  return true;
}
function findQuesCountInSubject(profile_questions, subject, question) {
  var count = 0;
  var usedcount = 0;
  var totalUnanswered = 0;
  var totalCorrect = 0;
  var totalIncorrect = 0;
  for (let index = 0; index < question.length; index++) {
    if (question[index].subject.id == subject.id) {
      count++;
      for (let j = 0; j < profile_questions.length; j++) {
        if (profile_questions[j].question == question[index].id) {
          usedcount++;
          if (profile_questions[j].isUnanswered) {
            totalUnanswered++;
          }
          if (profile_questions[j].isIncorrect) {
            totalIncorrect++;
          }
          if (profile_questions[j].isCorrect) {
            totalCorrect++;
          }
        }
      }
    }
  }
  return {
    used_count: usedcount.toString(),
    total_count: count.toString(),
    omitted: totalUnanswered,
    totalIncorrect: totalIncorrect,
    totalCorrect,
  };
}

function createObject(subjectName, id, usage, topic) {
  return {
    id: id,
    subject_name: subjectName,
    usage: usage,
    topic: topic,
  };
}
