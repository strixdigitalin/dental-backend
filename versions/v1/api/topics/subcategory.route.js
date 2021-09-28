const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { postSubcat, getAllTopics } = require("./subcategory.controller");
const router = express.Router();

router.route("/").post(postSubcat).get(getAllTopics);

module.exports = router;
