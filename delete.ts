import { DeleteItemOutput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
const AWS = require('aws-sdk');

const TABLE_NAME = "Products"

const dynamoDB: DocumentClient = new AWS.DynamoDB.DocumentClient()

module.exports.deleteAllProducts = async (event: any) => {
  try {
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
    return {
      statusCode: 200,
      body: JSON.stringify('Produtos deletados com sucesso'),
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