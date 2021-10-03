const mongoose = require("mongoose");
const MyError = require("../../error/MyError");
const SubTopic = require("./subtopics.model");

exports.postSubtopic = (req, res, next) => {
  const subcategory = new SubTopic({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    topic: req.body.topic,
  });
  subcategory
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

exports.getAllSubTopics = async (req, res, next) => {
  try {
    if (
      req.query.topicId &&
      !mongoose.Types.ObjectId.isValid(req.query.topicId)
    )
      throw new MyError(400, "Not a valid Topic Id.");

    const topicId = req.query.topicId;

    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 50;
    const search = req.query.search || "";

    const findBy = {
      title: { $regex: search, $options: "i" },
    };
    if (topicId) findBy.topic = topicId;

    const [topics, count] = await Promise.all([
      SubTopic.find(findBy)
        .sort({ _id: 1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate({
          path: "topic",
          select: "title id",
        }),
      SubTopic.countDocuments(findBy),
    ]);

    res.status(200).json({
      success: true,
      message: "success",
      count,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};
