const Question = require("../question/question.model");
const Test = require("./test.model");

exports.createTest = async (req, res, next) => {
  const { userId, mode, category, questionsCount } = req.body;
  //   category is an array of id's eg. ["6145eca028e76998823fd219", "6145ecd428e76998823fd21a"]
  try {
    const questions = await Question.find({
      category: {
        $in: category,
      },
    });
    const test = await Test.create({
      userId,
      mode,
      questions,
      questionsCount,
    });
    res.status(200).json({
      status: "ok",
      data: test,
    });
  } catch (error) {
    next(error);
  }
};
