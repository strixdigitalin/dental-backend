const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  addQuestionToCategory,
  getQuestionById
} = require("./question.controller");
const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.post('/add',AdminVerifyToken,createQuestion);
router.post('/',getAllQuestions);
router.patch('/cat/:id',verifyToken,addQuestionToCategory);
router.get("/:id", verifyToken,getQuestionById);

module.exports = router;
