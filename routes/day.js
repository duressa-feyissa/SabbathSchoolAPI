const express = require("express");
const router = express.Router();
const { SabbathSchool, validateDay } = require("../models/sabbathSchool");

router.post(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id/days",
  async (req, res) => {
    try {
      const { error } = validateDay(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const { lang, quarter_id, lesson_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}_${req.body.id}`;

      const day = new SabbathSchool.quarters.lessons.days({
        ...req.body,
        index,
      });
      await day.save();

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id/days",
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}`;

      const days = await SabbathSchool.quarters.lessons.days.find({ index });
      res.send(days);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id/days/:day_id",
  async (req, res) => {
    try {
      const { day_id } = req.params;
      const day = await SabbathSchool.quarters.lessons.days.findOne({
        index: `${req.params.lang}_${req.params.quarter_id}_${req.params.lesson_id}_${day_id}`,
      });
      if (!day)
        return res.status(404).send("The day with the given ID was not found.");
      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id/days/:day_id",
  async (req, res) => {
    try {
      const { error } = validateDay(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const { day_id } = req.params;
      const day = await SabbathSchool.quarters.lessons.days.findOneAndUpdate(
        {
          index: `${req.params.lang}_${req.params.quarter_id}_${req.params.lesson_id}_${day_id}`,
        },
        req.body,
        {
          new: true,
        }
      );

      if (!day)
        return res.status(404).send("The day with the given ID was not found.");

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/:lang/quarterlies/:quarter_id/lessons/:lesson_id/days/:day_id",
  async (req, res) => {
    try {
      const { day_id } = req.params;
      const day = await SabbathSchool.quarters.lessons.days.findOneAndRemove({
        index: `${req.params.lang}_${req.params.quarter_id}_${req.params.lesson_id}_${day_id}`,
      });
      if (!day)
        return res.status(404).send("The day with the given ID was not found.");

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
