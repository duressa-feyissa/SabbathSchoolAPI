const mongoose = require('mongoose');
const Joi = require('joi');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  start_date: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  index: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  cover: {
    type: String
  },
  end_date: {
    type: String
  }
});

const Lesson = mongoose.model('Lesson', LessonSchema);

function validateLesson(lesson) {
  const schema = Joi.object({
    title: Joi.string().required(),
    start_date: Joi.string().required(),
    id: Joi.string().required(),
    index: Joi.string().required(),
    cover: Joi.string().optional(),
    end_date: Joi.string().optional()
  });
  return schema.validate(lesson);
}

exports.Lesson = Lesson;
exports.validate = validateLesson;
