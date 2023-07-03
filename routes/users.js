const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User, validateUser } = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send("Invalid user ID");

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User not found");

    res.send(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      role: req.body.role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const response = user.toObject();
    delete response.password;

    res.send(response);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send("Invalid user ID");

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    user.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    user.role = req.body.role;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const response = user.toObject();
    delete response.password;

    res.send(response);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send("Invalid user ID");

    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send("User not found");

    const response = user.toObject();
    delete response.password;

    res.send(response);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
