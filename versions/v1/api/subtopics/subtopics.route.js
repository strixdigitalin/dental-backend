const express = require("express");
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
const {
  postSubtopic,
  getAllSubTopics,
  update,
} = require("./subtopics.controller");
const router = express.Router();

router.route("/").post(AdminVerifyToken, postSubtopic).get(getAllSubTopics);
router.patch("/update/:id", update);

module.exports = router;
