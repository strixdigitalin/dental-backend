const Subject = require("./subject.model");
const MyError = require("../../error/MyError");
const mongoose = require("mongoose");

exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjectDetails = async (req, res, next) => {
  try {
    const subjects = await Subject.aggregate([
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
          createdAt: 1,
          updatedAt: 1,
          topics: {
            $map: {
              input: "$topics",
              as: "topics",
              in: {
                id: "$$topics._id",
                title: "$$topics.title",
                subTopics: {
                  $map: {
                    input: "$$topics.subTopics",
                    as: "subTopics",
                    in: {
                      id: "$$subTopics._id",
                      title: "$$subTopics.title",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

exports.createSubject = (req, res, next) => {
  const category = new Subject({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
  });
  category
    .save()
    .then((data) => {
      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: data,
      });
    })
    .catch((err) => {
      next(err);
    });
};
