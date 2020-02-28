const express = require("express");
const router = express.Router();
const updateFeatured = require("../controllers/updateFeaturedController");

/* GET novels listing. */
// @Route /list
router.put("/", async (req, res, next) => {
  try {
    const response = await updateFeatured();
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
