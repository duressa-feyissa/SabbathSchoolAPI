const express = require("express");
const router = express.Router();
const { SabbathSchool, validateLanguage } = require("../models/sabbathSchool");
const { Read } = require("../models/read");
const { Introduction } = require("../models/introduction");
const authenticate = require("../middleWare/authentication");
const authorize = require("../middleWare/authorization");

router.get("/", async (req, res) => {
  const { sort, order } = req.params;
  let languages = [];

  if (sort) {
    languages = await SabbathSchool.find()
      .sort({ [sort]: order && order === "desc" ? -1 : 1 })
      .select("name code");
  } else {
    languages = await SabbathSchool.find().sort().select("name code");
  }

  res.send(languages);
});

router.get("/:lang", async (req, res) => {
  const language = await SabbathSchool.findOne({
    code: req.params.lang,
  }).select("name code");
  if (!language)
    return res
      .status(404)
      .send("The language with the given code was not found.");
  res.send(language);
});

router.post("/", authenticate, authorize(["admin"]), async (req, res) => {
  const { error } = validateLanguage(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { name, code } = req.body;

  const existingLanguage = await SabbathSchool.findOne({ code });
  if (existingLanguage) {
    return res.status(400).send("Language code must be unique.");
  }

  let language = new SabbathSchool({ name, code });
  language = await language.save();
  res.send(language);
});

router.put("/:lang", authenticate, authorize(["admin"]), async (req, res) => {
  const { error } = validateLanguage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name } = req.body;
  const lang = req.params.lang;

  const language = await SabbathSchool.findOneAndUpdate(
    { code: lang },
    { name },
    { new: true }
  ).select("name code");

  if (!language)
    return res
      .status(404)
      .send("The language with the given code was not found.");

  res.send(language);
});

router.delete(
  "/:lang",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    const lang = req.params.lang;
    const language = await SabbathSchool.findOneAndRemove({
      code: req.params.lang,
    }).select("name code");
    if (!language)
      return res
        .status(404)
        .send("The language with the given code was not found.");
    const langPattern = new RegExp(`^${lang}_`);
    await Read.deleteMany({ id: langPattern });
    await Introduction.deleteMany({ id: langPattern });
    res.send(language);
  }
);

module.exports = router;
