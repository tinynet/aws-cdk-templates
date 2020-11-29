"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";
const handler = async (event = {}) => {
    if (!event.body) {
        return { statusCode: 400, body: "Bad Request: missing body" };
    }
    const item = typeof event.body == "object" ? event.body : JSON.parse(event.body);
    item[PRIMARY_KEY] = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: item,
    };
    try {
        await db.put(params).promise();
        return { statusCode: 200, body: item };
    }
    catch (dbError) {
        return { statusCode: 500, body: JSON.stringify(dbError) };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcmVhdGUtaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWxDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7QUFDaEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO0FBRTNDLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBZ0IsRUFBRTtJQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNmLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRSxDQUFDO0tBQy9EO0lBQ0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO0lBQzdCLE1BQU0sTUFBTSxHQUFHO1FBQ2IsU0FBUyxFQUFFLFVBQVU7UUFDckIsSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDO0lBRUYsSUFBSTtRQUNGLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDeEM7SUFBQyxPQUFPLE9BQU8sRUFBRTtRQUNoQixPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0tBQzNEO0FBQ0gsQ0FBQyxDQUFDO0FBakJXLFFBQUEsT0FBTyxXQWlCbEIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1MgPSByZXF1aXJlKFwiYXdzLXNka1wiKTtcbmNvbnN0IHV1aWR2NCA9IHJlcXVpcmUoXCJ1dWlkL3Y0XCIpO1xuXG5jb25zdCBkYiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IFRBQkxFX05BTUUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIHx8IFwiXCI7XG5jb25zdCBQUklNQVJZX0tFWSA9IHByb2Nlc3MuZW52LlBSSU1BUllfS0VZIHx8IFwiXCI7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiA9PiB7XG4gIGlmICghZXZlbnQuYm9keSkge1xuICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDQwMCwgYm9keTogXCJCYWQgUmVxdWVzdDogbWlzc2luZyBib2R5XCIgfTtcbiAgfVxuICBjb25zdCBpdGVtID0gdHlwZW9mIGV2ZW50LmJvZHkgPT0gXCJvYmplY3RcIiA/IGV2ZW50LmJvZHkgOiBKU09OLnBhcnNlKGV2ZW50LmJvZHkpO1xuICBpdGVtW1BSSU1BUllfS0VZXSA9IHV1aWR2NCgpO1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgVGFibGVOYW1lOiBUQUJMRV9OQU1FLFxuICAgIEl0ZW06IGl0ZW0sXG4gIH07XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBkYi5wdXQocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogMjAwLCBib2R5OiBpdGVtIH07XG4gIH0gY2F0Y2ggKGRiRXJyb3IpIHtcbiAgICByZXR1cm4geyBzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRiRXJyb3IpIH07XG4gIH1cbn07XG4iXX0=