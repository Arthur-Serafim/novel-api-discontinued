const pupperteer = require("puppeteer");

async function listChapters(link) {
  let BASE_URL = `https://m.wuxiaworld.co${link}all.html`;

  const browser = await pupperteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(BASE_URL);

  const response = await page.evaluate(() => {
    let accumulator = [];
    let elements = document.querySelectorAll("div#chapterlist p a");
    for (item of elements) {
      if (item.getAttribute("href") !== "#bottom") {
        let chapter = {
          title: item.textContent,
          link: item.getAttribute("href")
        };
        accumulator.push(chapter);
      }
    }

    return accumulator;
  });

  return response;
}

module.exports = listChapters;
