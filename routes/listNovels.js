const express = require("express");
const router = express.Router();
const listNovel = require("../controllers/listNovelControler");
const { check, validationResult } = require("express-validator");

/* GET novels listing. */
// @Route /list
router.get(
  "/",
  [
    check("page", "Page is required")
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page } = req.body;
    try {
      const response = await listNovel(page);
      res.json(response);
    } catch (error) {
      console.error(error.message);
    }
  }
);

module.exports = router;
