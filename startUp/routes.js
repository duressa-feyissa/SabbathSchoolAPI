const multerError = require("../middleWare/multer-error");
const cors = require("../middleWare/cors");
const express = require("express");
const error = require("../middleWare/error");
const languages = require("../routes/languages");
const years = require("../routes/years");
const quarters = require("../routes/quarters");
const lessons = require("../routes/lessons");
const days = require("../routes/days");
const reads = require("../routes/reads");
const intrductions = require("../routes/introductions");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors);
  app.use("/api/v1", languages);
  app.use("/api/v1", years);
  app.use("/api/v1", quarters);
  app.use("/api/v1", lessons);
  app.use("/api/v1", days);
  app.use("/api/v1", reads);
  app.use("/api/v1", intrductions);
  app.use(multerError);
  app.use(error);
};
