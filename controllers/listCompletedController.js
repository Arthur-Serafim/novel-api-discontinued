const pupperteer = require("puppeteer");

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
    let accumulator = [];

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

    return accumulator;
  });

  return data;
}

async function listCompleted(page) {
  let BASE_URL;
  if (page === 0) {
    BASE_URL = "https://m.wuxiaworld.co/completed/";
  } else {
    BASE_URL = `https://m.wuxiaworld.co/completed_${page}/`;
  }

  try {
    let data = await handleScrape(BASE_URL);
    return data;
  } catch (error) {
    console.error(error.message);
    return;
  }
}

module.exports = listCompleted;
