const express = require("express");
const router = express.Router();
const { SabbathSchool, validateLesson } = require("../models/sabbathSchool");

router.post("/:lang/quarterlies/:quarter_id/lessons", async (req, res) => {
  try {
    const { error } = validateLesson(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { lang, quarter_id } = req.params;
    const index = `${lang}_${quarter_id}_${req.body.id}`;

    const lesson = new SabbathSchool.quarters.lessons({ ...req.body, index });
    await lesson.save();

    res.send(lesson);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/:lang/quarterlies/:quarter_id/lessons", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;
    const index = `${lang}_${quarter_id}`;

    const lessons = await SabbathSchool.quarters.lessons.find({ index });
    res.send(lessons);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id",
  async (req, res) => {
    try {
      const { lesson_id } = req.params;
      const lesson = await SabbathSchool.quarters.lessons.findOne({
        index: `${req.params.lang}_${req.params.quarter_id}_${lesson_id}`,
      });
      if (!lesson)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");
      res.send(lesson);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id",
  async (req, res) => {
    try {
      const { error } = validateLesson(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const { lesson_id } = req.params;
      const lesson = await SabbathSchool.quarters.lessons.findOneAndUpdate(
        { index: `${req.params.lang}_${req.params.quarter_id}_${lesson_id}` },
        req.body,
        {
          new: true,
        }
      );

      if (!lesson)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      res.send(lesson);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id",
  async (req, res) => {
    try {
      const { lesson_id } = req.params;
      const lesson = await SabbathSchool.quarters.lessons.findOneAndRemove({
        index: `${req.params.lang}_${req.params.quarter_id}_${lesson_id}`,
      });
      if (!lesson)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      res.send(lesson);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
