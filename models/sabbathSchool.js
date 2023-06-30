const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
    index: true,
  },
  quarters: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      human_date: {
        type: String,
        required: true,
      },
      start_date: {
        type: Date,
        required: true,
      },
      end_date: {
        type: Date,
        required: true,
      },
      index: {
        type: String,
        required: true,
        index: true,
      },
      id: {
        type: String,
        required: true,
        unique: true,
      },
      cover: {
        type: String,
        required: true,
      },
      lessons: [
        {
          title: {
            type: String,
            required: true,
          },
          start_date: {
            type: Date,
            required: true,
          },
          id: {
            type: String,
            required: true,
            unique: true,
          },
          cover: {
            type: String,
          },
          end_date: {
            type: Date,
          },
          index: {
            type: String,
            required: true,
            index: true,
          },
          days: [
            {
              title: {
                type: String,
                required: true,
              },
              date: {
                type: Date,
                required: true,
              },
              id: {
                type: String,
                required: true,
                unique: true,
              },
              index: {
                type: String,
                required: true,
                index: true,
              },
              read: {
                type: String,
                required: true,
              },
            },
          ],
        },
      ],
    },
  ],
});

const SabbathSchool = mongoose.model("SabbathSchool", schema);

function validateLanguage(language) {
  const schema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
  });
  return schema.validate(language);
}

function validateQuarter(quarter) {
  const quarterSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    human_date: Joi.string().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    id: Joi.string().required(),
    cover: Joi.string().required(),
  });
  return quarterSchema.validate(quarter);
}

function validateLesson(lesson) {
  const lessonSchema = Joi.object({
    title: Joi.string().required(),
    start_date: Joi.string().required(),
    id: Joi.string().required(),
    cover: Joi.string(),
    end_date: Joi.string(),
  });
  return lessonSchema.validate(lesson);
}

function validateDay(day) {
  const daySchema = Joi.object({
    title: Joi.string().required(),
    date: Joi.string().required(),
    id: Joi.string().required(),
    read: Joi.string().required(),
  });
  return daySchema.validate(day);
}

exports.SabbathSchool = SabbathSchool;
exports.validateLanguage = validateLanguage;
exports.validateQuarter = validateQuarter;
exports.validateLesson = validateLesson;
exports.validateDay = validateDay;
