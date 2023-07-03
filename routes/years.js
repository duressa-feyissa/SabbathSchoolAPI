const express = require("express");
const router = express.Router();
const { SabbathSchool } = require("../models/sabbathSchool");
const authenticate = require("../middleWare/authentication");
const authorize = require("../middleWare/authorization");

router.get(
  "/:lang/years/:year",
  authenticate,
  authorize(["admin", "user"]),
  async (req, res) => {
    try {
      const { lang, year } = req.params;

      const sabbathSchool = await SabbathSchool.findOne({ code: lang });

      if (!sabbathSchool)
        return res.status(404).send("The language was not found.");

      const quarters = sabbathSchool.quarters.filter((quarter) => {
        const quarterId = quarter.id.split("_")[0];
        return quarterId === year;
      });

      res.send(quarters);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

router.get(
  "/:lang/years",
  authenticate,
  authorize(["admin", "user"]),
  async (req, res) => {
    try {
      const { lang } = req.params;

      const sabbathSchool = await SabbathSchool.findOne({ code: lang });

      if (!sabbathSchool)
        return res.status(404).send("The language was not found.");

      const quartersByYear = {};

      sabbathSchool.quarters.forEach((quarter) => {
        const year = quarter.id.split("_")[0];

        if (!quartersByYear[year]) {
          quartersByYear[year] = [];
        }

        quartersByYear[year].push(quarter);
      });

      res.send(quartersByYear);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
