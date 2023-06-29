const mongoose = require('mongoose');

const quarterlySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  human_date: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  lang: {
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
  cover: {
    type: String,
    required: true
  }
});

const Quarterly = mongoose.model('Quarterly', quarterlySchema);

const Joi = require('joi');

function validateQuarterly(quarterly) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    human_date: Joi.string().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    lang: Joi.string().required(),
    id: Joi.string().required(),
    index: Joi.string().required(),
    cover: Joi.string().required()
  });

  return schema.validate(quarterly);
}

exports.Quarterly = Quarterly;
exports.validate = validateQuarterly;
