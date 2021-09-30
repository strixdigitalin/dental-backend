const Subject = require("./subject.model");
const MyError = require("../../error/MyError");
const Question = require("../question/question.model");
const mongoose = require('mongoose');
exports.getAllSubjects = async (req, res, next) => {
  try {
    // const subjects = await Subject.find({}).select('-__v -createdAt -updatedAt');
    const subjects = await Subject.aggregate([
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "subject",
          as: "topics"
        },
      },
      // {
      //   $unwind: {
      //     path: "$topics",
      //     preserveNullAndEmptyArrays: false,
      //   },
      // },
      {
        $lookup: {
          from: "subtopics",
          localField: "topics._id",
          foreignField: "topic",
          as: "topics.subtopics"
        },
       
      },
  

  
    ])
// let topics =[];
    // console.log(subjects)
    // for (let i = 0; i < subjects.length; i++) {
    //   const element = subjects[i];
    //   // console.log(element.topics)
    //   topics.push(element.topics)
    // }

    // console.log(topics)
    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

exports.getCatValues = async (req, res, next) => {
  try {
    const questions = await Question.find({});
    console.log(questions)
    const categories = await Subject.find({}).populate('topics', '-__v').select('-__v -createdAt -updatedAt');

  } catch (error) {
    next(error);
  }
}

exports.createSubject = (req, res, next) => {
  const category = new Subject({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title
  })
  category.save()
    .then((data) => {
      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: data
      });
    }).catch(err => { next(err) });
};
