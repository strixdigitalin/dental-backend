const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  addQuestionToCategory,
  getQuestionById,
  getCategory,
  getAllQuestionsUser,
  getTestExists,
  update,
  delById,
  getAllQuestionsForAdmin,
} = require("./question.controller");
const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.get("/", getAllQuestionsForAdmin);
router.get("/testExists", verifyToken, getTestExists);
// router.post("/user", verifyToken, getAllQuestionsUser);
router.post("/user", getAllQuestionsUser);
router.get("/categories", getCategory);
// router.post("/", AdminVerifyToken, createQuestion);
router.post("/", createQuestion);
router.patch("/cat/:id", verifyToken, addQuestionToCategory);
router.get("/test/:id", verifyToken, getQuestionById);
router.patch("/update/:id", update);
router.delete("/delete/:id", delById);

module.exports = router;
