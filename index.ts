import { DeleteItemOutput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { waitForTableCreation } from './functions';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
const AWS = require('aws-sdk');

const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium');
const cheerio = require('cheerio');

const url = "https://www.amazon.com.br/bestsellers)"
const TABLE_NAME = "Products"

const dynamoDB: DocumentClient = new AWS.DynamoDB.DocumentClient()
const dynamo = new AWS.DynamoDB()

interface Product {
  id: string;
  title: string;
  price: string;
  urlImg: string;
  rating: string;
}

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

    const products: Product[] = [];

    productsHtml.forEach((item: string) => {
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
        const { Items } = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();

        if (Items) {
          const deletePromisesPromise: Promise<PromiseResult<DeleteItemOutput, AWSError>>[] = Items.map(async (item: DocumentClient.AttributeMap) => {
            const paramsDelete = {
              TableName: TABLE_NAME,
              Key: {
                id: item.id
              }
            };

            return dynamoDB.delete(paramsDelete).promise();
          });

          await Promise.all(deletePromisesPromise);
        }

        const insertPromises: Promise<DocumentClient.PutItemOutput>[] = products.map(async (product: Product) => {
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
        message: 'web scraper done successfully'
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

