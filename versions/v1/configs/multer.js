const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
      // console.log(file)
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
}
});

module.exports = upload;
