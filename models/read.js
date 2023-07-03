const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
  },
  paragraphs: {
    type: [String],
    required: true,
  },
});

const Read = mongoose.model("Read", schema);

function validateRead(read) {
  const schema = Joi.object({
    id: Joi.string().required(),
    paragraphs: Joi.array().items(Joi.string().required()).min(1).required(),
  });

  return schema.validate(read);
}

exports.Read = Read;
exports.validateRead = validateRead;
