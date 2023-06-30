const express = require("express");
const router = express.Router();
const { SabbathSchool, validateQuarter } = require("../models/sabbathSchool");

router.post("/:lang/quarterlies", async (req, res) => {
  try {
    const { error } = validateQuarter(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { lang } = req.params;

    const quarter = new SabbathSchool.quarters({
      ...req.body,
      index: `${lang}_${req.body.id}`,
    });
    await quarter.save();

    res.send(quarter);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/:lang/quarterlies", async (req, res) => {
  try {
    const { lang } = req.params;

    const quarters = await SabbathSchool.quarters.find({
      index: { $regex: `^${lang}_` },
    });
    res.send(quarters);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/:lang/quarterlies/:quarter_id", async (req, res) => {
  try {
    const { quarter_id } = req.params;
    const quarter = await SabbathSchool.quarters.findOne({
      index: `${req.params.lang}_${quarter_id}`,
    });
    if (!quarter)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");
    res.send(quarter);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.put("/:lang/quarterlies/:quarter_id", async (req, res) => {
  try {
    const { error } = validateQuarter(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { quarter_id } = req.params;
    const quarter = await SabbathSchool.quarters.findOneAndUpdate(
      { index: `${req.params.lang}_${quarter_id}` },
      req.body,
      {
        new: true,
      }
    );

    if (!quarter)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");

    res.send(quarter);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete("/:lang/quarterlies/:quarter_id", async (req, res) => {
  try {
    const { quarter_id } = req.params;
    const quarter = await SabbathSchool.quarters.findOneAndRemove({
      index: `${req.params.lang}_${quarter_id}`,
    });
    if (!quarter)
      return res
        .status(404)
        .send("The quarter with the given ID was not found.");

    res.send(quarter);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
