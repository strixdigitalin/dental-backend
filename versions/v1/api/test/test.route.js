const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { createTest, getAllTestUser } = require("./test.controller");
const router = express.Router();

router.post('/',verifyToken,createTest);

router.get('/user',verifyToken,getAllTestUser);

module.exports = router;
