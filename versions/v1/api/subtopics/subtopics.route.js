const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { postSubtopic,getAllSubTopics  } = require("./subtopics.controller");
const router = express.Router();

router.route("/").post(postSubtopic).get(getAllSubTopics);

module.exports = router;