const express = require("express");
const router = express.Router();
const { SabbathSchool, validateLesson } = require("../models/sabbathSchool");

router.get("/:lang/quarterlies/:quarter_id/lessons", async (req, res) => {
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

    res.send(quarter.lessons);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.get(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id",
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;

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

      const lesson = quarter.lessons.find(
        (l) => l.index === `${lang}_${quarter_id}_${lesson_id}`
      );

      if (!lesson)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      res.send(lesson);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.post("/:lang/quarterlies/:quarter_id/lessons", async (req, res) => {
  try {
    const { lang, quarter_id } = req.params;

    const { error } = validateLesson(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.body;

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

    const existingLesson = quarter.lessons.find((lesson) => lesson.id === id);
    if (existingLesson)
      return res.status(400).send("A lesson with the same ID already exists.");

    const lesson = {
      ...req.body,
      index: `${lang}_${quarter_id}_${id}`,
    };

    quarter.lessons.push(lesson);
    await sabbathSchool.save();

    res.send(quarter.lessons);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.put(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id",
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;

      const { error } = validateLesson(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const updatedLesson = {
        ...req.body,
        index: `${lang}_${quarter_id}_${req.body.id}`,
      };

      const sabbathSchool = await SabbathSchool.findOneAndUpdate(
        {
          "quarters.index": `${lang}_${quarter_id}`,
          "quarters.lessons.id": lesson_id,
        },
        { $set: { "quarters.$[q].lessons.$[l]": updatedLesson } },
        {
          arrayFilters: [
            { "q.index": `${lang}_${quarter_id}` },
            { "l.id": lesson_id },
          ],
          new: true,
        }
      );

      if (!sabbathSchool)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      const quarter = sabbathSchool.quarters.find(
        (q) => q.index === `${lang}_${quarter_id}`
      );
      const lesson = quarter.lessons.find(
        (l) => l.index === `${lang}_${quarter_id}_${lesson_id}`
      );

      res.send(lesson);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id",
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;

      const sabbathSchool = await SabbathSchool.findOneAndUpdate(
        {
          "quarters.index": `${lang}_${quarter_id}`,
          "quarters.lessons.id": lesson_id,
        },
        { $pull: { "quarters.$.lessons": { id: lesson_id } } },
        { new: true }
      );

      if (!sabbathSchool)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      const quarter = sabbathSchool.quarters.find(
        (q) => q.index === `${lang}_${quarter_id}`
      );

      res.send(quarter.lessons);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
