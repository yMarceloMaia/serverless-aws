const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium');
const cheerio = require('cheerio');

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

    const html = await page.content();
    // const bodyHTML = await page.$eval('body', (body: { innerHTML: any; }) => body.innerHTML);
    // const bodyHTML = await page.evaluate(() => document.getElementById('zg_left_col1')?.innerHTML);
    // const pageTitle = await page.title();

    // const products = await page.evaluate((body: any) => {
    //   const productsPage = document.getElementById('zg_left_col1')

    //   return productsPage?.innerHTML
    // })
    // console.log('=================')
    // console.log(products)
    // console.log('=================')

    const productsHtml = await page.$$eval('.a-carousel', (items: any[]) => {
      return items.map(item => {
        const cardHtml = item.querySelector('.a-carousel-card').innerHTML;
        return cardHtml;
      });
    });

    const products: any = [];

    productsHtml.forEach((item: any) => {
      const $ = cheerio.load(item);
      const title = $('div.p13n-sc-truncate-desktop-type2').text();
      const price = $('span._cDEzb_p13n-sc-price_3mJ9Z').text();
      const urlImg = $('img').attr('src');
      const rating = $('span.a-icon-alt').text();

      const product = {
        title: title.trim(),
        price: price.trim(),
        urlImg: urlImg.trim(),
        rating: rating.trim()
      };

      products.push(product);
    });


    console.log(products);

    // const $ = cheerio.load(bodyHTML);

    // Use os seletores do Cheerio para extrair informações específicas
    // const pageTitle = $('title').text();

    // console.log(pageTitle);
    // console.log(bodyHTML);

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        products
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