const multerError = require("../middleWare/multer-error");
const cors = require("../middleWare/cors");
const express = require("express");
const error = require("../middleWare/error");
const languages = require("../routes/languages");
const quarters = require("../routes/quarters");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors);
  app.use("/api/v1", languages);
  app.use("/api/v1", quarters);
  app.use(multerError);
  app.use(error);
};
