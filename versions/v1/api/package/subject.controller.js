const Subject = require("./subject.model");
const MyError = require("../../error/MyError");
const mongoose = require("mongoose");
const async = require("async");
const createError = require("http-errors");

exports.getAllSubjects = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 50;
    const search = req.query.search || "";

    const findBy = {
      title: { $regex: search, $options: "i" },
    };

    const [subject, count] = await Promise.all([
      Subject.find(findBy)
        .sort({ _id: 1 })
        .skip(limit * (page - 1))
        .limit(limit),
      Subject.countDocuments(findBy),
    ]);

    res.status(200).json({
      success: true,
      message: "success",
      count,
      data: subject,
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
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
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
        success: true,
        message: "Created Successfully",
        data: data,
      });
    })
    .catch((err) => {
      next(err);
    });
};





exports.update = async (req, res, next) => {
  const body = req.body || {};
  const id = req.params.id;
  try {
    if (!id) throw createError.NotFound("Id Is Required");
    if (Object.keys(body).length == 0)
      throw createError.NotAcceptable("Body Is Empty");
    var exist = await Subject.findOne({ _id: id });
    if (!exist) throw createError.NotFound("NOT FOUND");
    Subject.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { returnOriginal: false },
      (err, doc) => {
        if (err) throw createError.NotFound("NOT FOUND");
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
