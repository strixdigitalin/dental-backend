const MyError = require("../error/MyError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  if (!req.headers['authorization']) return next(new MyError(401, "Unauthorized"))
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new MyError(400, "No token"));
  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return next(new MyError(400, "Invalid token"));
    req.user = user;
    next();
  });
};

exports.AdminVerifyToken = (req, res, next) => {
  if (!req.headers['authorization']) return next(new MyError(401, "Unauthorized"))
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new MyError(400, "No token"));
  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return next(new MyError(400, "Invalid token"));
    req.user = user;
    next();
  });
};

