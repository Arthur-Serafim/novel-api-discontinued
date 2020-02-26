const express = require("express");
const router = express.Router();
const updateFeatured = require("../controllers/updateFeaturedController");

/* GET novels listing. */
// @Route /list
router.put("/", async (req, res, next) => {
  const response = await updateFeatured();
  res.json(response);
});

module.exports = router;
