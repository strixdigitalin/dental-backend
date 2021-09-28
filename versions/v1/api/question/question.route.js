const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  getQuestionsByCategory,
  addQuestionToCategory
} = require("./question.controller");
const router = express.Router();
const { verifyToken } = require("../../middlewares/auth");

router.post('/add',createQuestion);
router.post('/',getAllQuestions);
router.patch('/cat/:id',verifyToken,addQuestionToCategory);
// router.get("/category", getQuestionsByCategory);

module.exports = router;
