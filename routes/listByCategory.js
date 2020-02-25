const express = require("express");
const router = express.Router();
const listByCategory = require("../controllers/listByCategoryController");
const { check, validationResult } = require("express-validator");

/* GET novels listing. */
// @Route /list
router.get(
  "/",
  [
    check("category", "Category is required")
      .not()
      .isEmpty(),
    check("page", "Page is required")
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, page } = req.body;
    try {
      const response = await listByCategory(category, page);
      res.json(response);
    } catch (error) {
      console.error(error.message);
    }
  }
);

module.exports = router;
