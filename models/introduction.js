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

const Introduction = mongoose.model("Introductions", schema);

function validateIntroduction(read) {
  const schema = Joi.object({
    paragraphs: Joi.array().items(Joi.string().required()).required(),
  });

  return schema.validate(read);
}

exports.Introduction = Introduction;
exports.validateIntroduction = validateIntroduction;
