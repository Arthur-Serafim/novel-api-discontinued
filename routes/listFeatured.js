const express = require("express");
const router = express.Router();
const listFeatured = require("../controllers/listFeaturedController");
const { check, validationResult } = require("express-validator");

/* GET novels listing. */
// @Route /list
router.get("/", async (req, res, next) => {
  const response = await listFeatured();
  res.json(response);
});

module.exports = router;
