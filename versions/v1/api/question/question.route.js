const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  addQuestionToCategory,
  getQuestionById,
  getCategory
} = require("./question.controller");
const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.get("/",verifyToken, getAllQuestions);
router.get("/categories", getCategory);
router.post("/", AdminVerifyToken, createQuestion);
router.patch("/cat/:id", verifyToken, addQuestionToCategory);
router.get("/test/:id", verifyToken, getQuestionById);

module.exports = router;
