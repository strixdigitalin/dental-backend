const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { createTest, getAllTestUser, getAllAnswersCount } = require("./test.controller");
const router = express.Router();

router.post('/',verifyToken,createTest);

router.get('/user',verifyToken,getAllTestUser);

router.get('/answersCount',verifyToken,getAllAnswersCount);

module.exports = router;
