const MyError = require("../error/MyError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log({ token });
  if (!token) return next(new MyError(400, "no token"));
  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return next(new MyError(400, "invalid token"));
    req.user = user;
    next();
  });
};
