const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Featured = require("../models/Featured");
const mongoose = require("mongoose");

dotenv.config();

let password = process.env.PASSWORD;
const DATABASE_URL = `mongodb+srv://ReadWrite:${password}@mern-klqx1.mongodb.net/test?retryWrites=true&w=majority`;

const connectDb = () => {
  return mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
};

router.get("/", async (req, res) => {
  connectDb();
  const db = mongoose.connection;

  let categories = [
    "All",
    "Xianxia",
    "Romantic",
    "Historical",
    "Sci-fi",
    "Game"
  ];
  let response = {};

  for (category of categories) {
    try {
      let data = await Featured.find({ category });
      response = { ...response, [category]: data };
    } catch (error) {
      console.error(error.message);
    }
  }

  res.json(response);

  await db.close();
});

module.exports = router;
