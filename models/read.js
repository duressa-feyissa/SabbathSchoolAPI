const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
  },
  read: {
    type: String,
    required: true,
    index: true,
  },
});

const Read = mongoose.model("Read", schema);

function validateRead(read) {
  const schema = Joi.object({
    id: Joi.string().required(),
    read: Joi.string().required(),
  });

  return schema.validate(read);
}

exports.Read = Read;
exports.validateRead = validateRead;
