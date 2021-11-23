const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { createTestResult, getTestResultsById,getAllTestResultsUser, topicPerfomance } = require("./test_result.controller");
const router = express.Router();


router.post("/add",verifyToken ,createTestResult);
router.get("/all",verifyToken, getAllTestResultsUser);
router.get("/:id",verifyToken, getTestResultsById);
router.get('/topic/perfomance',verifyToken,topicPerfomance);

module.exports = router;