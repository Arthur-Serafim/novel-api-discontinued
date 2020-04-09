async function listChapters(link, browser) {
  try {
    let BASE_URL = `https://m.wuxiaworld.co${link}all.html`;

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on("request", (request) => {
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

    const response = await page.evaluate(() => {
      let accumulator = [];
      let elements = document.querySelectorAll("div#chapterlist p a");
      let counter = 1;
      for (item of elements) {
        if (item.getAttribute("href") !== "#bottom") {
          let chapter = {
            title: item.textContent,
            link: item.getAttribute("href"),
            number: counter,
          };
          counter++;
          accumulator.push(chapter);
        }
      }

      return accumulator;
    });

    return response;
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = listChapters;
