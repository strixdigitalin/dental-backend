var express = require("express");
var router = express.Router();

const videoController = require("./video.controller");

router
  .route("/")
  .post(videoController.createFile)
  .get(videoController.showAllFiles);

router.route("/:id").get(videoController.showFileById);

module.exports = router;
