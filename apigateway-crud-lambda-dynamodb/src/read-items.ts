const AWS = require("aws-sdk");

const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";

export const handler = async (event: any = {}): Promise<any> => {
  if (!event.pathParameters) {
    try {
      const params = {
        TableName: TABLE_NAME,
      };
      const response = await db.scan(params).promise();
      return { statusCode: 200, body: JSON.stringify(response.Items) };
    } catch (dbError) {
      return { statusCode: 500, body: JSON.stringify(dbError) };
    }
  } else {
    const requestedItemId = event.pathParameters.id;
    if (!requestedItemId) {
      return { statusCode: 500, body: "Bad Request: missing id parameter" };
    } else {
      try {
        const params = {
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: requestedItemId,
          },
        };
        const response = await db.get(params).promise();
        return { statusCode: 200, body: JSON.stringify(response.Item) };
      } catch (dbError) {
        return { statusCode: 500, body: JSON.stringify(dbError) };
      }
    }
  }
};
