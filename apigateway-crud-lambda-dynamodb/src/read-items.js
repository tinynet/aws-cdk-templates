"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";
const handler = async (event = {}) => {
    if (!event.pathParameters) {
        try {
            const params = {
                TableName: TABLE_NAME,
            };
            const response = await db.scan(params).promise();
            return { statusCode: 200, body: JSON.stringify(response.Items) };
        }
        catch (dbError) {
            return { statusCode: 500, body: JSON.stringify(dbError) };
        }
    }
    else {
        const requestedItemId = event.pathParameters.id;
        if (!requestedItemId) {
            return { statusCode: 500, body: "Bad Request: missing id parameter" };
        }
        else {
            try {
                const params = {
                    TableName: TABLE_NAME,
                    Key: {
                        [PRIMARY_KEY]: requestedItemId,
                    },
                };
                const response = await db.get(params).promise();
                return { statusCode: 200, body: JSON.stringify(response.Item) };
            }
            catch (dbError) {
                return { statusCode: 500, body: JSON.stringify(dbError) };
            }
        }
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZC1pdGVtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlYWQtaXRlbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRS9CLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7QUFDaEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO0FBRTNDLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBZ0IsRUFBRTtJQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtRQUN6QixJQUFJO1lBQ0YsTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsU0FBUyxFQUFFLFVBQVU7YUFDdEIsQ0FBQztZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUNsRTtRQUFDLE9BQU8sT0FBTyxFQUFFO1lBQ2hCLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDM0Q7S0FDRjtTQUFNO1FBQ0wsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNwQixPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsbUNBQW1DLEVBQUUsQ0FBQztTQUN2RTthQUFNO1lBQ0wsSUFBSTtnQkFDRixNQUFNLE1BQU0sR0FBRztvQkFDYixTQUFTLEVBQUUsVUFBVTtvQkFDckIsR0FBRyxFQUFFO3dCQUNILENBQUMsV0FBVyxDQUFDLEVBQUUsZUFBZTtxQkFDL0I7aUJBQ0YsQ0FBQztnQkFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2hELE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQ2pFO1lBQUMsT0FBTyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDM0Q7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxDQUFDO0FBOUJXLFFBQUEsT0FBTyxXQThCbEIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1MgPSByZXF1aXJlKFwiYXdzLXNka1wiKTtcblxuY29uc3QgZGIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCBUQUJMRV9OQU1FID0gcHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSB8fCBcIlwiO1xuY29uc3QgUFJJTUFSWV9LRVkgPSBwcm9jZXNzLmVudi5QUklNQVJZX0tFWSB8fCBcIlwiO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55ID0ge30pOiBQcm9taXNlPGFueT4gPT4ge1xuICBpZiAoIWV2ZW50LnBhdGhQYXJhbWV0ZXJzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgVGFibGVOYW1lOiBUQUJMRV9OQU1FLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZGIuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuSXRlbXMpIH07XG4gICAgfSBjYXRjaCAoZGJFcnJvcikge1xuICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNTAwLCBib2R5OiBKU09OLnN0cmluZ2lmeShkYkVycm9yKSB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCByZXF1ZXN0ZWRJdGVtSWQgPSBldmVudC5wYXRoUGFyYW1ldGVycy5pZDtcbiAgICBpZiAoIXJlcXVlc3RlZEl0ZW1JZCkge1xuICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNTAwLCBib2R5OiBcIkJhZCBSZXF1ZXN0OiBtaXNzaW5nIGlkIHBhcmFtZXRlclwiIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICBUYWJsZU5hbWU6IFRBQkxFX05BTUUsXG4gICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICBbUFJJTUFSWV9LRVldOiByZXF1ZXN0ZWRJdGVtSWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkYi5nZXQocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuSXRlbSkgfTtcbiAgICAgIH0gY2F0Y2ggKGRiRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNTAwLCBib2R5OiBKU09OLnN0cmluZ2lmeShkYkVycm9yKSB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==