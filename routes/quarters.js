const express = require("express");
const router = express.Router();
const { SabbathSchool, validateQuarter } = require("../models/sabbathSchool");

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

    const quarter = {
      ...req.body,
      index: `${lang}_${id}`,
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

    if (!SabbathSchool)
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

    const updatedQuarter = {
      ...req.body,
      index: `${lang}_${req.body.id}`,
    };

    const sabbathSchool = await SabbathSchool.findOneAndUpdate(
      { "quarters.id": quarter_id },
      { $set: { "quarters.$": updatedQuarter } },
      { new: true }
    );

    if (!sabbathSchool)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");

    res.send(updatedQuarter);
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

    res.send(sabbathSchool.quarters);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/:lang/quarters/:quarter_id/image", async (req, res) => {
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

module.exports = router;
