const express = require("express");
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
const {
  postSubcat,
  postTopics,
  getAllTopics,
  update,
} = require("./topics.controller");
const router = express.Router();

router.route("/").post(AdminVerifyToken, postTopics).get(getAllTopics);
router.patch("/update/:id", update);
module.exports = router;
