const express = require("express");
const router = express.Router();
const { SabbathSchool, validateDay } = require("../models/sabbathSchool");
const { Read, validateRead } = require("../models/read");

const baseurl = "http://localhost:3000/api/v1";

router.post(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days",
  async (req, res) => {
    try {
      const { error } = validateDay(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const { lang, quarter_id, lesson_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}_${req.body.id}`;

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

      const existingDay = lesson.days.find((d) => d.index === index);
      if (existingDay)
        return res.status(400).send("A day with the same ID already exists.");

      const path = `${baseurl}/${lang}/quarters/${quarter_id}/lessons/${lesson_id}/days/${req.body.id}/read`;
      const day = {
        ...req.body,
        index,
        read: path,
      };

      data = { read: req.body.read, id: index };
      const { readError } = validateRead(data);
      if (readError) return res.status(400).send(readError.details[0].message);

      const read = new Read(data);
      await read.save();

      lesson.days.push(day);
      await sabbathSchool.save();

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
      console.log(error);
    }
  }
);

router.get(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days",
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

      res.send(lesson.days);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days/:day_id",
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id, day_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}_${day_id}`;

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

      const day = lesson.days.find((d) => d.index === index);

      if (!day)
        return res.status(404).send("The day with the given ID was not found.");

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days/:day_id",
  async (req, res) => {
    try {
      const { error } = validateDay(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const { lang, quarter_id, lesson_id, day_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}_${day_id}`;

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

      const day = lesson.days.find((d) => d.index === index);

      if (!day)
        return res.status(404).send("The day with the given ID was not found.");

      Object.assign(day, req.body);
      await sabbathSchool.save();

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days/:day_id",
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id, day_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}_${day_id}`;

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

      const dayIndex = lesson.days.findIndex((d) => d.index === index);

      if (dayIndex === -1)
        return res.status(404).send("The day with the given ID was not found.");

      const day = lesson.days[dayIndex];
      lesson.days.splice(dayIndex, 1);
      await sabbathSchool.save();

      await Read.findOneAndDelete({ id: index });

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
