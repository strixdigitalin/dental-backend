const yup = require("yup");
const MyError = require("../../error/MyError");
const fs = require("fs");
const path = require("path");
const File = require("./video.model");
const { validate } = require("../../helpers/validate");

const fileValidation = yup.object({
  thumbnail: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
  createdAt: yup
    .string()
    .matches(/^[0-9]+$/, "Date should be a unix number.")
    .length(13, "Unix date should be exactly 13 digits long.")
    .required(),
  duration: yup
    .string()
    .matches(/^[0-9]+$/, "Duration should be a number (in seconds).")
    .required(),
});

exports.createFile = async (req, res, next) => {
  try {
    const data = await validate(fileValidation, req.body);

    await File.create({
      ...data,
    });

    res.json({
      success: true,
      data: "File created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.showAllFiles = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 50;

    const file = await File.find({})
      .sort({ _id: 1 })
      .skip(limit * (page - 1))
      .limit(limit);

    res.json({
      success: true,
      data: [...file],
    });
  } catch (error) {
    next(error);
  }
};

exports.showFileById = async (req, res, next) => {
  try {
    const file = await File.find({ _id: req.params.id });

    res.json({
      success: true,
      data: file.length === 0 ? null : file,
    });
  } catch (error) {
    next(error);
  }
};
