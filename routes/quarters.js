const express = require("express");
const router = express.Router();
const { SabbathSchool, validateQuarter } = require("../models/sabbathSchool");
const { Read } = require("../models/read");
const config = require("config");
const { Introduction } = require("../models/introduction");
const upload = require("../middleWare/upload");
const path = require("path");
const base_url = config.get("base_url");

router.post("/:lang/quarters", async (req, res) => {
  try {
    const { lang } = req.params;

    const { error } = validateQuarter(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.body;

    let sabbathSchool = await SabbathSchool.findOne({ code: lang });

    if (!sabbathSchool)
      return res.status(404).send("The language was not found.");

    const existingQuarter = sabbathSchool.quarters.find(
      (quarter) => quarter.id === id
    );
    if (existingQuarter)
      return res.status(400).send("A quarter with the same ID already exists.");

    const introUrl = `${base_url}/${lang}/quarters/${id}/introduction`;

    const quarter = {
      ...req.body,
      index: `${lang}_${id}`,
      introduction: introUrl,
    };

    sabbathSchool.quarters.push(quarter);
    await sabbathSchool.save();

    res.send(sabbathSchool.quarters);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.get("/:lang/quarters", async (req, res) => {
  try {
    const { lang } = req.params;

    const sabbathSchool = await SabbathSchool.findOne({ code: `${lang}` });

    if (!sabbathSchool)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");
    res.send(sabbathSchool.quarters);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/:lang/quarters/:quarter_id", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;

    const sabbathSchool = await SabbathSchool.findOne({
      "quarters.index": `${lang}_${quarter_id}`,
    });

    if (!sabbathSchool)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");

    const quarter = sabbathSchool.quarters.find(
      (q) => q.index === `${lang}_${quarter_id}`
    );

    res.send(quarter);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.put("/:lang/quarters/:quarter_id", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;

    const { error } = validateQuarter(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let sabbathSchool = await SabbathSchool.findOne({
      "quarters.index": `${lang}_${quarter_id}`,
    });

    const quarter = sabbathSchool.quarters.find(
      (q) => q.index === `${lang}_${quarter_id}`
    );

    sabbathSchool = await SabbathSchool.findOneAndUpdate(
      {
        "quarters.index": `${lang}_${quarter_id}`,
      },
      {
        $set: {
          "quarters.$.title": req.body.title,
          "quarters.$.description": req.body.description,
          "quarters.$.human_date": req.body.human_date,
          "quarters.$.start_date": req.body.start_date,
          "quarters.$.end_date": req.body.end_date,
          "quarters.$.cover": req.body.cover,
          "quarters.$.color_primary": req.body.color_primary,
          "quarters.$.color_primary_dark": req.body.color_primary_dark,
          "quarters.$.introduction": `${base_url}/${lang}/quarters/${quarter_id}/introduction`,
          "quarters.$.lessons": quarter.lessons,
        },
      },
      { new: true }
    );

    if (!sabbathSchool)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");

    res.send(sabbathSchool.quarters.find((q) => q.id === quarter_id));
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.delete("/:lang/quarters/:quarter_id", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;

    const sabbathSchool = await SabbathSchool.findOneAndUpdate(
      { code: lang },
      { $pull: { quarters: { id: quarter_id } } },
      { new: true }
    );

    if (!sabbathSchool)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");

    const langPattern = new RegExp(`^${lang}_${quarter_id}`);
    await Read.deleteMany({ id: langPattern });

    await Introduction.deleteMany({ id: langPattern });

    const updatedQuarters = sabbathSchool.quarters;
    res.send(updatedQuarters);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/:lang/quarters/:quarter_id/image", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;

    const sabbathSchool = await SabbathSchool.findOne({
      "quarters.index": `${lang}_${quarter_id}`,
    });

    if (!sabbathSchool) {
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");
    }

    const quarter = sabbathSchool.quarters.find(
      (q) => q.index === `${lang}_${quarter_id}`
    );

    const imagePath = quarter.cover;

    if (!imagePath) {
      return res.status(404).send("Image not found for the specified quarter.");
    }

    const imageName = imagePath.split("/").pop();

    const imageFilePath = path.join(__dirname, "../uploads", imageName);
    res.sendFile(imageFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post(
  "/:lang/quarters/:quarter_id/image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { lang, quarter_id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).send("Please upload a file");
      }

      const sabbathSchool = await SabbathSchool.findOneAndUpdate(
        {
          "quarters.index": `${lang}_${quarter_id}`,
        },
        {
          $set: {
            "quarters.$.cover": `${base_url}/${lang}/quarters/${quarter_id}/${file.filename}`,
          },
        },
        { new: true }
      );

      if (!sabbathSchool) {
        return res
          .status(404)
          .send("The quarter with the given ID was not found.");
      }
      res.send("File uploaded successfully.");
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
