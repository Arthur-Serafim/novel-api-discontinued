const pupperteer = require("puppeteer");

let urls = [
  "https://m.wuxiaworld.co/top/week.html",
  "https://m.wuxiaworld.co/top/week2.html",
  "https://m.wuxiaworld.co/top/week3.html",
  "https://m.wuxiaworld.co/top/week4.html",
  "https://m.wuxiaworld.co/top/week5.html",
  "https://m.wuxiaworld.co/top/week6.html"
];

async function handleScrape(BASE_URL) {
  const browser = await pupperteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(BASE_URL);

  const textContent = await page.evaluate(() => {
    const elements = document.querySelectorAll("div.hot_sale");
    const category = document.querySelector("a.on").textContent.trim();
    let accumulator = [];
    let response = [];

    for (item of elements) {
      let title = item.querySelector("a p.title").textContent.trim();
      let image = item.querySelector("a img").getAttribute("data-original");
      let link = item.querySelector("a").getAttribute("href");

      accumulator = [...accumulator, { title, image, link }];
    }

    for (item of accumulator) {
      response.push({ ...item, category });
    }

    return response;
  });

  await browser.close();

  return textContent;
}

async function listFeatured() {
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
  return response;
}

module.exports = listFeatured;
