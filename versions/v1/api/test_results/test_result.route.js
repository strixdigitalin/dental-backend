const express = require("express");
const { createTestResult } = require("./test_result.controller");
const router = express.Router();


router.post("/add", createTestResult);
// router.get("/all", getAllSubscription);


module.exports = router;