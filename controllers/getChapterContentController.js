const puppeteer = require("puppeteer");

async function getChapterContent(link, chapter) {
  let BASE_URL = `https://m.wuxiaworld.co${link}${chapter}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", request => {
    if (
      ["image", "stylesheet", "font", "script"].indexOf(
        request.resourceType()
      ) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setDefaultNavigationTimeout(0);
  await page.goto(BASE_URL);

  const data = await page.evaluate(() => {
    try {
      let content = document
        .querySelector("div#chaptercontent")
        .innerText.split(`a title=”” href`)[0]
        .trim();

      return content;
    } catch (error) {
      console.error(error.message);
      return "";
    }
  });

  return data;
}
module.exports = getChapterContent;
