const Test = require("./test_result.model");
const mongoose = require("mongoose");
const createError = require("http-errors");
const questionModel = require("../question/question.model");
const ObjectId = mongoose.Types.ObjectId;
const Subject = require("../package/subject.model");
const Profile = require("../profile/profile.model");
const topicModel = require("../topics/topics.model");
const async = require("async");
const subtopicsModel = require("../subtopics/subtopics.model");
var differenceBy = require("lodash.differenceby");

exports.createTestResult = (req, res, next) => {
  const testResult = new Test({
    _id: new mongoose.Types.ObjectId(),
    // test_name: req.body.test_name,
    package: req.body.package,
    mode: req.body.mode,
    // user: req.user.id,
    user: "6158464fa0282b1bd73c922d",
    // subjects: req.body.subjectId,
    // subTopics: req.body.subTopicId,
    // topics: req.body.topicId,
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

      // console.log(subject);
      // questions_details.forEach((question) => {
      //   questionModel.findById(question.question).then((data) => {
      //     // console.log(data);
      //     Subject.findOne({ _id: data.package }).then((subject) => {
      //       var user = subject.user;
      //       if (user.length == 0) {
      //         Subject.findByIdAndUpdate(
      //           { _id: ObjectId(data.subject) },
      //           { $push: { user: question } }
      //         ).then((result) => {});
      //       }
      //       if (user.length > 0) {
      //         Subject.findOneAndUpdate(
      //           {
      //             _id: ObjectId(data.subject),
      //             "user.question": question.question,
      //             "user.userId": req.user.id,
      //           },
      //           {
      //             $pull: {
      //               user: {
      //                 $and: [
      //                   { userId: req.user.id },
      //                   { question: question.question },
      //                 ],
      //               },
      //             },
      //           },
      //           { returnDocument: "after" }
      //         ).then((result) => {
      //           Subject.findByIdAndUpdate(
      //             { _id: ObjectId(data.subject) },
      //             { $push: { user: question } }
      //           ).then((result) => {});
      //         });
      //       }
      //     });
      //   });
      // });

      //topic
      // questions_details.forEach((question) => {
      //   questionModel.findById(question.question).then((data) => {
      //     // console.log(data);
      //     topicModel.findOne({ _id: data.topic }).then((topic) => {
      //       var user = topic.user;
      //       if (user.length == 0) {
      //         topicModel
      //           .findByIdAndUpdate(
      //             { _id: ObjectId(data.topic) },
      //             { $push: { user: question } }
      //           )
      //           .then((result) => {});
      //       }
      //       if (user.length > 0) {
      //         topicModel
      //           .findOneAndUpdate(
      //             {
      //               _id: ObjectId(data.topic),
      //               "user.question": question.question,
      //               "user.userId": req.user.id,
      //             },
      //             {
      //               $pull: {
      //                 user: {
      //                   $and: [
      //                     { userId: req.user.id },
      //                     { question: question.question },
      //                   ],
      //                 },
      //               },
      //             },
      //             { returnDocument: "after" }
      //           )
      //           .then((result) => {
      //             topicModel
      //               .findByIdAndUpdate(
      //                 { _id: ObjectId(data.topic) },
      //                 { $push: { user: question } }
      //               )
      //               .then((result) => {});
      //           });
      //       }
      //     });
      //   });
      // });

      //subtopic
      // questions_details.forEach((question) => {
      //   questionModel.findById(question.question).then((data) => {
      //     // console.log(data);
      //     subtopicsModel.findOne({ _id: data.subtopic }).then((subtopic) => {
      //       var user = subtopic.user;
      //       if (user.length == 0) {
      //         subtopicsModel
      //           .findByIdAndUpdate(
      //             { _id: ObjectId(data.subtopic) },
      //             { $push: { user: question } }
      //           )
      //           .then((result) => {});
      //       }
      //       if (user.length > 0) {
      //         subtopicsModel
      //           .findOneAndUpdate(
      //             {
      //               _id: ObjectId(data.subtopic),
      //               "user.question": question.question,
      //               "user.userId": req.user.id,
      //             },
      //             {
      //               $pull: {
      //                 user: {
      //                   $and: [
      //                     { userId: req.user.id },
      //                     { question: question.question },
      //                   ],
      //                 },
      //               },
      //             },
      //             { returnDocument: "after" }
      //           )
      //           .then((result) => {
      //             subtopicsModel
      //               .findByIdAndUpdate(
      //                 { _id: ObjectId(data.subtopic) },
      //                 { $push: { user: question } }
      //               )
      //               .then((result) => {});
      //           });
      //       }
      //     });
      //   });
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

exports.EditTest = async (req, res, next) => {
  try {
    // const data = new Test({
    //   package: req.body.package,
    //   mode: req.body.mode,
    //   user: userId,
    //   questions_details: req.body.questions_details,
    //   totalIncorrect: req.body.totalIncorrect,
    //   totalQuestion: req.body.totalQuestion,
    //   totalCorrect: req.body.totalCorrect,
    //   totalUnanswered: req.body.totalUnanswered,
    //   totalTimeSpend: req.body.totalTimeSpend,
    //   totalMarked: req.body.totalMarked,
    //   totalScore: (+req.body.totalCorrect * 100) / +req.body.totalQuestion,
    // });
    console.log(req.body);
    const {
      totalIncorrect,
      totalCorrect,
      totalUnanswered,
      totalMarked,
      totalTimeSpend,
    } = req.body;
    const { data } = await Test.findByIdAndUpdate(req.body.testId, {
      $push: {
        questions_details: req.body.question_details,
      },
      isTestCompleted: req.body.isTestCompleted,
      $inc: {
        totalIncorrect: totalIncorrect,
        totalCorrect: totalCorrect,
        totalUnanswered: totalUnanswered,
        totalMarked: totalMarked,
        totalTimeSpend: totalTimeSpend,
      },
    });
    res.status(200).send({
      statusCode: 200,
      message: "success",
      data,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.createTestResultPackage = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const userId = req.user.id;
    console.log(bodyData, "<<<<body data");
    const data = new Test({
      package: req.body.package,
      mode: req.body.mode,
      user: userId,
      // user: "6158464fa0282b1bd73c922d",
      questions_details: req.body.questions_details,
      totalIncorrect: req.body.totalIncorrect,
      totalQuestion: req.body.totalQuestion,
      totalCorrect: req.body.totalCorrect,
      totalUnanswered: req.body.totalUnanswered,
      totalTimeSpend: req.body.totalTimeSpend,
      endTime: req.body.endTime,
      totalMarked: req.body.totalMarked,
      totalScore: (+req.body.totalCorrect * 100) / +req.body.totalQuestion,
    });
    const checkSave = await data.save();
    console.log(checkSave, "<<<<checkSave");

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: checkSave,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllTestResultsUser = async (req, res, next) => {
  try {
    const { testId } = req.params;
    // const testResults = await Test.aggregate([
    //   {
    //     $match: {
    //       user: ObjectId(req.user.id),
    //     },
    //   },
    //   {
    //     $sort: { createdAt: -1 },
    //   },
    //   {
    //     $project: {
    //       questions_details: 0,
    //       user: 0,
    //       __v: 0,
    //     },
    //   },
    // ]);

    const testResults = await Test.find({ user: "6158464fa0282b1bd73c922d" });
    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: testResults,
    });
  } catch (error) {
    next(error);
  }
};

// exports.getInCompleted

exports.testCompleted = async (req, res, next) => {
  const { id } = req.params;
  const { data } = await Test.findByIdAndUpdate(
    id,
    { isTestCompleted: true },
    { new: true }
  );
  res.status(200).send({ success: true, statusCode: 200, data });
};

exports.getTestResultsById = async (req, res, next) => {
  try {
    // const testResults = await Test.findOne({
    //   $and: [{ user: req.user.id }, { _id: req.params.id }],
    // }).populate({
    const testResults = await Test.findOne({
      $and: [{ user: "6158464fa0282b1bd73c922d" }, { _id: req.params.id }],
    }).populate("questions_details.question");

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
                    totalQuestion: subtopic.questionCount,
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
