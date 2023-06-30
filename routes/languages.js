const express = require("express");
const router = express.Router();
const { SabbathSchool, validateLanguage } = require("../models/sabbathSchool");

router.get("/languages", async (req, res) => {
  const { sort, order } = req.params;
  let languages = [];
  if (sort)
    languages = await SabbathSchool.find().sort({
      [sort]: order && order === "desc" ? -1 : 1,
    });
  else languages = await SabbathSchool.find().sort();

  res.send(languages);
});

router.get("/languages/:lang", async (req, res) => {
  const language = await SabbathSchool.findOne({ code: req.params.lang });
  if (!language)
    return res
      .status(404)
      .send("The language with the given code was not found.");
  res.send(language);
});

router.post("/languages", async (req, res) => {
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

router.put("/languages/:lang", async (req, res) => {
  const { error } = validateLanguage(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { name, code } = req.body;

  const language = await SabbathSchool.findOneAndUpdate(
    { code: req.params.lang },
    { name, code },
    {
      new: true,
    }
  );

  if (!language)
    return res
      .status(404)
      .send("The language with the given code was not found.");
  res.send(language);
});

router.delete("/languages/:lang", async (req, res) => {
  const language = await SabbathSchool.findOneAndRemove({
    code: req.params.lang,
  });
  if (!language)
    return res
      .status(404)
      .send("The language with the given code was not found.");
  res.send(language);
});

module.exports = router;
