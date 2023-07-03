const express = require("express");
const router = express.Router();
const { SabbathSchool, validateLesson } = require("../models/sabbathSchool");
const { Read } = require("../models/read");
const config = require("config");
const base_url = config.get("base_url");
const upload = require("../middleWare/upload");
const path = require("path");
const authenticate = require("../middleWare/authentication");
const authorize = require("../middleWare/authorization");

router.get(
  "/:lang/quarters/:quarter_id/lessons",
  authenticate,
  authorize(["admin", "user"]),
  async (req, res) => {
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
  }
);

router.get(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id",
  authenticate,
  authorize(["admin", "user"]),
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

router.post(
  "/:lang/quarters/:quarter_id/lessons",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
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
        return res
          .status(400)
          .send("A lesson with the same ID already exists.");

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
  }
);

router.put(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;

      const { error } = validateLesson(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const existingLesson = await SabbathSchool.findOne({
        "quarters.index": `${lang}_${quarter_id}`,
        "quarters.lessons.id": lesson_id,
      });

      if (!existingLesson)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      const existingQuarter = existingLesson.quarters.find(
        (q) => q.index === `${lang}_${quarter_id}`
      );
      const existingLessonIndex = existingQuarter.lessons.findIndex(
        (l) => l.id === lesson_id
      );

      if (existingLessonIndex === -1)
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");

      const existingDays = existingQuarter.lessons[existingLessonIndex].days;

      const updatedLesson = {
        ...req.body,
        id: lesson_id,
        index: `${lang}_${quarter_id}_${lesson_id}`,
        days: existingDays,
      };

      existingQuarter.lessons[existingLessonIndex] = updatedLesson;

      await existingLesson.save();

      res.send(updatedLesson);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id",
  authenticate,
  authorize(["admin"]),
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

      const langPattern = new RegExp(`^${lang}_${quarter_id}_${lesson_id}_`);
      await Read.deleteMany({ id: langPattern });

      res.send(quarter.lessons);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/image",
  authenticate,
  authorize(["admin", "user"]),
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;

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

      const lesson = quarter.lessons.find(
        (l) => l.index === `${lang}_${quarter_id}_${lesson_id}`
      );

      if (!lesson) {
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");
      }

      const imagePath = lesson.cover;

      if (!imagePath) {
        return res
          .status(404)
          .send("Image not found for the specified lesson.");
      }

      const imageName = imagePath.split("/").pop();

      const imageFilePath = path.join(__dirname, "../uploads", imageName);
      res.sendFile(imageFilePath);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/image",
  authenticate,
  authorize(["admin"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).send("Please upload a file");
      }

      const sabbathSchool = await SabbathSchool.findOneAndUpdate(
        {
          "quarters.index": `${lang}_${quarter_id}`,
          "quarters.lessons.id": lesson_id,
        },
        {
          $set: {
            "quarters.$[q].lessons.$[l].cover": `${base_url}/${lang}/quarters/${quarter_id}/lessons/${lesson_id}/${file.filename}`,
          },
        },
        {
          arrayFilters: [
            { "q.index": `${lang}_${quarter_id}` },
            { "l.id": lesson_id },
          ],
          new: true,
        }
      );

      if (!sabbathSchool) {
        return res
          .status(404)
          .send("The lesson with the given ID was not found.");
      }

      res.send("File uploaded successfully.");
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
