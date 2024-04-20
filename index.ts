const puppeteer = require('puppeteer-core')
const chromium = require("@sparticuz/chromium");

const url = "https://www.amazon.com.br/bestsellers)"

module.exports.scraper = async (event: any) => {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url);

    const pageTitle = await page.title();

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        pageTitle,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};