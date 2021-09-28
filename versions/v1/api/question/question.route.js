const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  getQuestionsByCategory,
} = require("./question.controller");
const router = express.Router();

router.post('/add',createQuestion);
router.post('/',getAllQuestions)
// router.get("/category", getQuestionsByCategory);

module.exports = router;
