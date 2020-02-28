const pupperteer = require("puppeteer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Featured = require("../models/Featured");

dotenv.config();

let password = process.env.PASSWORD;
const DATABASE_URL = `mongodb+srv://ReadWrite:${password}@mern-klqx1.mongodb.net/test?retryWrites=true&w=majority`;

const connectDb = () => {
  return mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
};

let urls = [
  "https://m.wuxiaworld.co/top/week.html",
  "https://m.wuxiaworld.co/top/week2.html",
  "https://m.wuxiaworld.co/top/week3.html",
  "https://m.wuxiaworld.co/top/week4.html",
  "https://m.wuxiaworld.co/top/week5.html",
  "https://m.wuxiaworld.co/top/week6.html"
];

async function handleScrape(BASE_URL) {
  const browser = await pupperteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", request => {
    if (
      ["stylesheet", "font", "script"].indexOf(request.resourceType()) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setDefaultNavigationTimeout(0);
  await page.goto(BASE_URL);

  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll("div.hot_sale");
    const category = document.querySelector("a.on").textContent.trim();
    let accumulator = [];
    let response = [];

    for (item of elements) {
      let title = item.querySelector("a p.title").textContent.trim();
      let image = item.querySelector("a img").getAttribute("data-original");
      let link = item.querySelector("a").getAttribute("href");
      let synopsis = item
        .querySelector("p.review")
        .textContent.trim()
        .split("Introduce：")[1]
        .split("Description")
        .join("");
      let author = item
        .querySelector("p.author")
        .textContent.trim()
        .split("Author：")
        .join("");

      accumulator = [...accumulator, { title, image, link, synopsis, author }];
    }

    for (item of accumulator) {
      response.push({ ...item, category });
    }

    return response;
  });

  await browser.close();

  return data;
}

async function updateFeatured() {
  let response = [];
  for (url of urls) {
    try {
      let data = await handleScrape(url);
      response = [...response, ...data];
    } catch (error) {
      console.error(error.message);
      continue;
    }
  }

  await connectDb();
  const db = mongoose.connection;
  await Featured.deleteMany({});

  for (item of response) {
    let featured = new Featured({
      title: item.title,
      image: item.image,
      link: item.link,
      category: item.category,
      synopsis: item.synopsis,
      author: item.author
    });

    try {
      await featured.save();
    } catch (error) {
      console.error(error.message);
    }
  }

  await db.close();

  return response;
}

module.exports = updateFeatured;
