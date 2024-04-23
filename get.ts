const AWS = require('aws-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const TABLE_NAME = "Products"
const dynamoDB: DocumentClient = new AWS.DynamoDB.DocumentClient()

module.exports.getAllProducts = async (event: any) => {
    try {
        const data = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
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

module.exports.getProductById = async (event: any) => {
    try {
        const { productId } = event.pathParameters;
        const params = {
            TableName: TABLE_NAME,
            Key: {
                id: productId,
            },
        };
        const data = await dynamoDB.get(params).promise();
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Product not found',
                }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),
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
