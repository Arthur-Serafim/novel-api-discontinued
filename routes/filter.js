const express = require("express");
const router = express.Router();
const filter = require("../controllers/filterController");
const { check, validationResult } = require("express-validator");

/* GET novels listing. */
// @Route /list
router.get(
  "/",
  [
    check("novel", "Novel is required")
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { novel } = req.body;
    try {
      const response = await filter(novel);
      res.json(response);
    } catch (error) {
      console.error(error.message);
    }
  }
);

module.exports = router;
