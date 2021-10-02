const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { postSubcat, postTopics, getAllTopics } = require("./topics.controller");
const router = express.Router();

router.route("/").post(postTopics).get(getAllTopics);

module.exports = router;
