const express = require("express");
const router = express.Router();
const { Read } = require("../models/read");
const authenticate = require("../middleWare/authentication");
const authorize = require("../middleWare/authorization");

router.get(
  "/:lang/quarters/:quarter_id/lessons/:lesson_id/days/:day_id/read",

  async (req, res) => {
    try {
      const { lang, quarter_id, lesson_id, day_id } = req.params;
      const index = `${lang}_${quarter_id}_${lesson_id}_${day_id}`;
      const reads = await Read.findOne({ id: index });
      if (!reads) {
        return res.status(404).send("No reads found.");
      }
      res.send(reads);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
