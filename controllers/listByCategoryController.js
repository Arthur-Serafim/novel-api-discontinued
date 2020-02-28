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

async function listByCategory(category, page) {
  let categories = {
    all: "https://m.wuxiaworld.co/category/0/",
    fantasy: "https://m.wuxiaworld.co/category/1/",
    xianxia: "https://m.wuxiaworld.co/category/2/",
    romantic: "https://m.wuxiaworld.co/category/3/",
    scifi: "https://m.wuxiaworld.co/category/4/",
    historical: "https://m.wuxiaworld.co/category/5/"
  };

  let url = `${categories[category]}${page}.html`;
  try {
    let data = await handleScrape(url);
    return data;
  } catch (error) {
    console.error(error.message);
    return;
  }
}

module.exports = listByCategory;
