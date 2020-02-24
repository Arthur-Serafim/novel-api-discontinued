const pupperteer = require("puppeteer");

async function getNovel(novel) {
  let BASE_URL = `https://m.wuxiaworld.co${novel}`;
  const browser = await pupperteer.launch();
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

  let response = page.evaluate(() => {
    let data = document.querySelector("div.synopsisArea_detail");

    let title = document.querySelector("span.title").textContent;
    let author = data.childNodes[3].textContent.trim().split("Author：")[1];
    let category = data.childNodes[5].textContent.trim().split("Category：")[1];
    let image = data.childNodes[1].src;
    let status = data.childNodes[7].textContent.trim().split("Status：")[1];
    let update = data.childNodes[11].textContent.trim().split("Updates：")[1];

    let novel = {
      title,
      author,
      category,
      image,
      status,
      update
    };

    return novel;
  });

  return response;
}

module.exports = getNovel;
