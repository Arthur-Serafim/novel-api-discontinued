const express = require("express");
const router = express.Router();
const listByCategory = require("../controllers/listByCategoryController");
const { check, validationResult } = require("express-validator");
const puppeteer = require("puppeteer");

/* GET novels listing. */
// @Route /list
router.post(
  "/",
  [
    check("category", "Category is required").not().isEmpty(),
    check("page", "Page is required").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, page } = req.body;
    try {
      const response = await listByCategory(category, page, browser);
      res.json(response);
    } catch (error) {
      console.error(error.message);
    }

    await browser.close();
  }
);

module.exports = router;
