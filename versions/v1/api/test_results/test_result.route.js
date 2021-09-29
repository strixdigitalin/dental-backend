const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { createTestResult, getAllTestResults } = require("./test_result.controller");
const router = express.Router();


router.post("/add",verifyToken ,createTestResult);
router.get("/all",verifyToken, getAllTestResults);


module.exports = router;