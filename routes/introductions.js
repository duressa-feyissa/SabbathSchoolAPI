const express = require("express");
const router = express.Router();
const {
  Introduction,
  validateIntroduction,
} = require("../models/introduction");

router.get("/:lang/quarters/:quarter_id/introduction", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;
    const index = `${lang}_${quarter_id}`;
    const introduction = await Introduction.findOne({ id: index });
    res.send(introduction);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post("/:lang/quarters/:quarter_id/introduction", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;
    const { paragraphs } = req.body;

    const { error } = validateIntroduction(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const introduction = await Introduction.findOneAndUpdate(
      { id: `${lang}_${quarter_id}` },
      { id: `${lang}_${quarter_id}`, paragraphs },
      { upsert: true, new: true }
    );

    res.send(introduction);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.delete("/:lang/quarters/:quarter_id/introduction", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;

    const introduction = await Introduction.findOneAndDelete({
      id: `${lang}_${quarter_id}`,
    });

    if (!introduction) {
      return res
        .status(404)
        .send("The introduction with the given ID was not found.");
    }

    res.send(introduction);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
