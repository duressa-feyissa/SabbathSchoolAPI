const express = require("express");
const router = express.Router();
const { SabbathSchool, validateDay } = require("../models/sabbathSchool");
const { Read, validateRead } = require("../models/read");
const config = require("config");
const authenticate = require("../middleWare/authentication");
const authorize = require("../middleWare/authorization");

const baseurl = config.get("base_url");

router.post(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days",
  authenticate,
  authorize(["admin"]),
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

      const readData = {
        id: index,
        paragraphs: req.body.read,
      };

      const { error: readError } = validateRead(readData);
      if (readError) return res.status(400).send(readError.details[0].message);

      const read = new Read(readData);
      await read.save();

      const path = `${baseurl}/${lang}/quarters/${quarter_id}/lessons/${lesson_id}/days/${req.body.id}/read`;
      const day = {
        ...req.body,
        index,
        read: path,
      };

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
  authenticate,
  authorize(["admin"]),
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

      let day = lesson.days.find((d) => d.index === index);

      if (!day)
        return res.status(404).send("The day with the given ID was not found.");

      const readData = {
        id: index,
        paragraphs: req.body.read,
      };

      const { error: readError } = validateRead(readData);
      if (readError) return res.status(400).send(readError.details[0].message);

      await Read.findOneAndUpdate(
        { id: index },
        { $set: readData },
        { new: true }
      );

      const path = `${baseurl}/${lang}/quarters/${quarter_id}/lessons/${lesson_id}/days/${day_id}/read`;
      const newday = {
        ...req.body,
        id: day_id,
        index,
        read: path,
      };

      Object.assign(day, newday);
      await sabbathSchool.save();

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days/:day_id",
  authenticate,
  authorize(["admin"]),
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

      const langPattern = new RegExp(
        `^${lang}_${quarter_id}_${lesson_id}_${day_id}`
      );
      await Read.deleteMany({ id: langPattern });

      res.send(day);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
