const express = require("express");
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
const { postSubcat, postTopics, getAllTopics } = require("./topics.controller");
const router = express.Router();

router.route("/").post(AdminVerifyToken,postTopics).get(getAllTopics);

module.exports = router;
