import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { waitForTableCreation } from './functions';
const AWS = require('aws-sdk');

const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium');
const cheerio = require('cheerio');

const url = "https://www.amazon.com.br/bestsellers)"
const TABLE_NAME = "Products"

const dynamoDB: DocumentClient = new AWS.DynamoDB.DocumentClient()
const dynamo = new AWS.DynamoDB()

// Parâmetros para criação de tabela no dynamoDB
const params = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

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
        id: Date.now().toString(),
        title: title.trim(),
        price: price.trim(),
        urlImg: urlImg.trim(),
        rating: rating.trim()
      };

      products.push(product);
    });

    await browser.close();

    const paramsTable = {
      TableName: TABLE_NAME,
    };

    try {
      const already = await waitForTableCreation(dynamo, params, paramsTable);

      if (already) {
        const insertPromises = products.map((product: any) => {
          const paramsInsert = {
            TableName: 'Products',
            Item: product
          };

          return dynamoDB.put(paramsInsert).promise();
        });

        await Promise.all(insertPromises);

        console.log("Todos os produtos foram inseridos com sucesso no DynamoDB");
      }
    } catch (error) {
      console.error("Erro ao inserir produtos no DynamoDB:", error);
      throw new Error("Erro ao inserir produtos no DynamoDB");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${products.length > 0 ? 'web scraper done successfully' : 'web scraper done failed'}`
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

