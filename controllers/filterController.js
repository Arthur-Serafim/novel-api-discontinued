const puppeteer = require("puppeteer");

async function filter(novel) {
  let BASE_URL = `https://m.wuxiaworld.co`;
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);
  await page.goto(BASE_URL);

  await page.waitFor("input.searchForm_input");

  await page.evaluate(async (novel) => {
    let input = await document.querySelector("input.searchForm_input");
    input.value = novel;
  }, novel);

  await page.click('input[type="submit"]');

  let response = page.evaluate(() => {
    let data = document.querySelectorAll("div.hot_sale");
    let accumulator = [];

    for (item of data) {
      let title = item.childNodes[2].childNodes[1].textContent.trim();
      let category = item.childNodes[2].childNodes[3].textContent
        .trim()
        .split(" | Author：")[0];
      let author = item.childNodes[2].childNodes[3].textContent
        .trim()
        .split(" | Author：")[1];
      let relevance = item.childNodes[1].childNodes[0].textContent.trim();
      let link = item.childNodes[2].getAttribute("href");

      let novel = {
        title,
        author,
        link,
        category,
        relevance,
      };

      accumulator.push(novel);
    }
    return accumulator;
  });
  
  await browser.close();

  return response;
}

module.exports = filter;
