const express = require("express");
const { createTest } = require("./test.controller");
const router = express.Router();

router.route("/").post(createTest);

module.exports = router;
