const questionModel = require("../packageQuestion/question.model");
const subjectModel = require("../package/subject.model");
const authModel = require("../auth/auth.model");

exports.getAllData = async (req, res, next) => {
  try {
    const Question = await questionModel.countDocuments();
    const Packages = await subjectModel.countDocuments();
    const users = await authModel.countDocuments();
    console.log(Question, "<<<number of question", Packages, users);
    res.status(200).json({
      success: true,
      message: "success",

      data: { Question, Packages, users },
    });
  } catch (e) {
    console.log(e);
  }
};
