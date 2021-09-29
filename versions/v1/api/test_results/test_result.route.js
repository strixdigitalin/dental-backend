const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { createTestResult, getTestResultsById,getAllTestResultsUser } = require("./test_result.controller");
const router = express.Router();


router.post("/add",verifyToken ,createTestResult);
router.get("/all",verifyToken, getAllTestResultsUser);
router.get("/:id",verifyToken, getTestResultsById);


module.exports = router;