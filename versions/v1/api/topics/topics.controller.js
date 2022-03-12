const mongoose = require("mongoose");
const MyError = require("../../error/MyError");
const Topics = require("./topics.model");
const createError = require("http-errors");

exports.postTopics = (req, res, next) => {
  const subcategory = new Topics({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    subject: req.body.subject,
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

exports.getAllTopics = async (req, res, next) => {
  try {
    if (
      req.query.subjectId &&
      !mongoose.Types.ObjectId.isValid(req.query.subjectId)
    )
      throw new MyError(400, "Not a valid Subject Id.");

    const subjectId = req.query.subjectId;

    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 50;
    const search = req.query.search || "";

    const findBy = {
      title: { $regex: search, $options: "i" },
    };
    if (subjectId) findBy.subject = subjectId;

    const [topics, count] = await Promise.all([
      Topics.find(findBy)
        .sort({ _id: 1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("subject", "id title"),
      Topics.countDocuments(findBy),
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

exports.update = async (req, res, next) => {
  const body = req.body || {};
  const id = req.params.id;
  try {
    if (!id) throw createError.NotFound("Id Is Required");
    if (Object.keys(body).length == 0)
      throw createError.NotAcceptable("Body Is Empty");
    var exist = await Topics.findOne({ _id: id });
    if (!exist) throw createError.NotFound("NOT FOUND");
    Topics.findOneAndUpdate(
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
