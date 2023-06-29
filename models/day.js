const mongoose = require('mongoose');
const Joi = require('joi');

const daySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
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
  read: {
    type: String,
    required: true
  }
});

const Day = mongoose.model('Day', daySchema);



const dailyLessonValidationSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required(),
  id: Joi.string().required(),
  index: Joi.string().required(),
    read: Joi.string().required()
});
