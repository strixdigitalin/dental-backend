const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();


  
const app = express();
app.use(cors());

//Connection db
require('./versions/v1/helpers/init.mongodb');

require('events').EventEmitter.defaultMaxListeners = 15;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// OK route.
app.get("/", (_req, res) => {
  res.send("OK");
});

const v1 = require("./versions/v1/routes");
app.use("/api/v1", v1);

// 404 route.
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// error handler
const errorHandler = require("./versions/v1/error/handleError");
app.use(errorHandler);

module.exports = app;
