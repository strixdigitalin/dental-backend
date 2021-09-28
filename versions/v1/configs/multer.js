const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // eslint-disable-next-line no-undef
    const dirPath = path.join(__dirname, "../../../public/uploads");
    cb(null, dirPath);
  },

  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

var upload = multer({
  storage: storage,
});

module.exports = upload;
