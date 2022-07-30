const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

//Connection db
require("./versions/v1/helpers/init.mongodb");

const app = express();
app.use(cors());

require("events").EventEmitter.defaultMaxListeners = 15;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// OK route.
app.get("/", (_req, res) => {
  res.send("OK");
});

const v1 = require("./versions/v1/routes");
app.use("/api/v1", v1);

app.use((req, res, next) => {
  const error = new Error("Bad Request");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
