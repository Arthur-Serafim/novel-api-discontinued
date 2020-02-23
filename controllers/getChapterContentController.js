const pupperteer = require("puppeteer");

async function getChapterContent(link, chapter) {
  console.log("Getting chapter chapter");
  let BASE_URL = `https://m.wuxiaworld.co${link}${chapter}`;

  const browser = await pupperteer.launch();
  const page = await browser.newPage();
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
