const multerError = require('../middleWare/multer-error');
const cors = require('../middleWare/cors');
const express = require("express");
const error = require('../middleWare/error');

module.exports = function(app) {
    app.use(express.json());
    app.use(cors);

    app.use(multerError);
    app.use(error);
}