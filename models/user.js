const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).max(100).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "admin"),
  };
  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;
