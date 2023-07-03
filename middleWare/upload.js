const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const { lang, quarter_id } = req.params;
    const fileName = `${lang}_${quarter_id}.${file.originalname
      .split(".")
      .pop()}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
  const isAllowedFormat = allowedFormats.includes(file.mimetype);
  if (isAllowedFormat) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Uploaded file is not an image. Allowed image formats: ${allowedFormats.join(
          ", "
        )}`
      ),
      false
    );
  }
};

module.exports = multer({ storage, fileFilter });
