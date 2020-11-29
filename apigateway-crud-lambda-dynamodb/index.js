"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsOptions = exports.RestApiCrudLambdaDynamoDB = void 0;
const apigateway = require("@aws-cdk/aws-apigateway");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
class RestApiCrudLambdaDynamoDB extends cdk.Stack {
    constructor(app, id, tableName, partitionKeyName) {
        super(app, id);
        const dynamoTable = new dynamodb.Table(this, tableName, {
            partitionKey: {
                name: partitionKeyName,
                type: dynamodb.AttributeType.STRING,
            },
            tableName: tableName,
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new table, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will delete the table (even if it has data in it)
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const readItems = new lambda.Function(this, "readItems", {
            code: new lambda.AssetCode("src"),
            handler: "read-items.handler",
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: partitionKeyName,
            },
        });
        const createItem = new lambda.Function(this, "createItem", {
            code: new lambda.AssetCode("src"),
            handler: "create-item.handler",
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: partitionKeyName,
            },
        });
        const updateItem = new lambda.Function(this, "updateItem", {
            code: new lambda.AssetCode("src"),
            handler: "update-item.handler",
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: partitionKeyName,
            },
        });
        const deleteItem = new lambda.Function(this, "deleteItem", {
            code: new lambda.AssetCode("src"),
            handler: "delete-item.handler",
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: partitionKeyName,
            },
        });
        dynamoTable.grantReadWriteData(readItems);
        dynamoTable.grantReadWriteData(createItem);
        dynamoTable.grantReadWriteData(updateItem);
        dynamoTable.grantReadWriteData(deleteItem);
        const api = new apigateway.RestApi(this, "crudAPIDynamoDB", {
            restApiName: "CRUD Service for DynamoDB",
        });
        const apiRoot = api.root.addResource(tableName);
        const idResource = apiRoot.addResource("{id}");
        addCorsOptions(apiRoot);
        addCorsOptions(idResource);
        apiRoot.addMethod("POST", new apigateway.LambdaIntegration(createItem));
        apiRoot.addMethod("GET", new apigateway.LambdaIntegration(readItems));
        idResource.addMethod("GET", new apigateway.LambdaIntegration(readItems));
        idResource.addMethod("PUT", new apigateway.LambdaIntegration(updateItem));
        idResource.addMethod("DELETE", new apigateway.LambdaIntegration(deleteItem));
    }
}
exports.RestApiCrudLambdaDynamoDB = RestApiCrudLambdaDynamoDB;
function addCorsOptions(apiResource) {
    apiResource.addMethod("OPTIONS", new apigateway.MockIntegration({
        integrationResponses: [
            {
                statusCode: "200",
                responseParameters: {
                    "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    "method.response.header.Access-Control-Allow-Origin": "'*'",
                    "method.response.header.Access-Control-Allow-Credentials": "'false'",
                    "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'",
                },
            },
        ],
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestTemplates: {
            "application/json": '{"statusCode": 200}',
        },
    }), {
        methodResponses: [
            {
                statusCode: "200",
                responseParameters: {
                    "method.response.header.Access-Control-Allow-Headers": true,
                    "method.response.header.Access-Control-Allow-Methods": true,
                    "method.response.header.Access-Control-Allow-Credentials": true,
                    "method.response.header.Access-Control-Allow-Origin": true,
                },
            },
        ],
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new cdk.App();
const tableName = app.node.tryGetContext("tableName");
const partitionKeyName = app.node.tryGetContext("partitionKeyName");
console.log("tablename: " + tableName + " partitoinKey: " + partitionKeyName);
new RestApiCrudLambdaDynamoDB(app, "RestApiCrudLambdaDynamoDB", tableName, partitionKeyName);
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBdUQ7QUFDdkQsa0RBQW1EO0FBQ25ELDhDQUErQztBQUMvQyxxQ0FBc0M7QUFFdEMsTUFBYSx5QkFBMEIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN0RCxZQUFZLEdBQVksRUFBRSxFQUFVLEVBQUUsU0FBaUIsRUFBRSxnQkFBd0I7UUFDL0UsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3RELFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ3BDO1lBQ0QsU0FBUyxFQUFFLFNBQVM7WUFFcEIsZ0dBQWdHO1lBQ2hHLHFHQUFxRztZQUNyRyx5RUFBeUU7WUFDekUsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN2RCxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUNqQyxPQUFPLEVBQUUsb0JBQW9CO1lBQzdCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUztnQkFDakMsV0FBVyxFQUFFLGdCQUFnQjthQUM5QjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3pELElBQUksRUFBRSxJQUFJ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cUQsRUFDbkQseUZBQXlGO29CQUMzRixvREFBb0QsRUFBRSxLQUFLO29CQUMzRCx5REFBeUQsRUFBRSxTQUFTO29CQUNwRSxxREFBcUQsRUFBRSwrQkFBK0I7aUJBQ3ZGO2FBQ0Y7U0FDRjtRQUNELG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLO1FBQ3pELGdCQUFnQixFQUFFO1lBQ2hCLGtCQUFrQixFQUFFLHFCQUFxQjtTQUMxQztLQUNGLENBQUMsRUFDRjtRQUNFLGVBQWUsRUFBRTtZQUNmO2dCQUNFLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixrQkFBa0IsRUFBRTtvQkFDbEIscURBQXFELEVBQUUsSUFBSTtvQkFDM0QscURBQXFELEVBQUUsSUFBSTtvQkFDM0QseURBQXlELEVBQUUsSUFBSTtvQkFDL0Qsb0RBQW9ELEVBQUUsSUFBSTtpQkFDM0Q7YUFDRjtTQUNGO0tBQ0YsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQW5DRCx3Q0FtQ0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN0RCxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsU0FBUyxHQUFHLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDLENBQUM7QUFDOUUsSUFBSSx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDN0YsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwaWdhdGV3YXkgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXlcIik7XG5pbXBvcnQgZHluYW1vZGIgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWR5bmFtb2RiXCIpO1xuaW1wb3J0IGxhbWJkYSA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtbGFtYmRhXCIpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xuXG5leHBvcnQgY2xhc3MgUmVzdEFwaUNydWRMYW1iZGFEeW5hbW9EQiBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogY2RrLkFwcCwgaWQ6IHN0cmluZywgdGFibGVOYW1lOiBzdHJpbmcsIHBhcnRpdGlvbktleU5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKGFwcCwgaWQpO1xuXG4gICAgY29uc3QgZHluYW1vVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgdGFibGVOYW1lLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgbmFtZTogcGFydGl0aW9uS2V5TmFtZSxcbiAgICAgICAgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICB9LFxuICAgICAgdGFibGVOYW1lOiB0YWJsZU5hbWUsXG5cbiAgICAgIC8vIFRoZSBkZWZhdWx0IHJlbW92YWwgcG9saWN5IGlzIFJFVEFJTiwgd2hpY2ggbWVhbnMgdGhhdCBjZGsgZGVzdHJveSB3aWxsIG5vdCBhdHRlbXB0IHRvIGRlbGV0ZVxuICAgICAgLy8gdGhlIG5ldyB0YWJsZSwgYW5kIGl0IHdpbGwgcmVtYWluIGluIHlvdXIgYWNjb3VudCB1bnRpbCBtYW51YWxseSBkZWxldGVkLiBCeSBzZXR0aW5nIHRoZSBwb2xpY3kgdG9cbiAgICAgIC8vIERFU1RST1ksIGNkayBkZXN0cm95IHdpbGwgZGVsZXRlIHRoZSB0YWJsZSAoZXZlbiBpZiBpdCBoYXMgZGF0YSBpbiBpdClcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIE5PVCByZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbiBjb2RlXG4gICAgfSk7XG5cbiAgICBjb25zdCByZWFkSXRlbXMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIFwicmVhZEl0ZW1zXCIsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuQXNzZXRDb2RlKFwic3JjXCIpLFxuICAgICAgaGFuZGxlcjogXCJyZWFkLWl0ZW1zLmhhbmRsZXJcIixcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgICBQUklNQVJZX0tFWTogcGFydGl0aW9uS2V5TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjcmVhdGVJdGVtID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcImNyZWF0ZUl0ZW1cIiwge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoXCJzcmNcIiksXG4gICAgICBoYW5kbGVyOiBcImNyZWF0ZS1pdGVtLmhhbmRsZXJcIixcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgICBQUklNQVJZX0tFWTogcGFydGl0aW9uS2V5TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGRhdGVJdGVtID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcInVwZGF0ZUl0ZW1cIiwge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoXCJzcmNcIiksXG4gICAgICBoYW5kbGVyOiBcInVwZGF0ZS1pdGVtLmhhbmRsZXJcIixcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgICBQUklNQVJZX0tFWTogcGFydGl0aW9uS2V5TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWxldGVJdGVtID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcImRlbGV0ZUl0ZW1cIiwge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoXCJzcmNcIiksXG4gICAgICBoYW5kbGVyOiBcImRlbGV0ZS1pdGVtLmhhbmRsZXJcIixcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgICBQUklNQVJZX0tFWTogcGFydGl0aW9uS2V5TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEocmVhZEl0ZW1zKTtcbiAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoY3JlYXRlSXRlbSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHVwZGF0ZUl0ZW0pO1xuICAgIGR5bmFtb1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShkZWxldGVJdGVtKTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgXCJjcnVkQVBJRHluYW1vREJcIiwge1xuICAgICAgcmVzdEFwaU5hbWU6IFwiQ1JVRCBTZXJ2aWNlIGZvciBEeW5hbW9EQlwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpUm9vdCA9IGFwaS5yb290LmFkZFJlc291cmNlKHRhYmxlTmFtZSk7XG4gICAgY29uc3QgaWRSZXNvdXJjZSA9IGFwaVJvb3QuYWRkUmVzb3VyY2UoXCJ7aWR9XCIpO1xuICAgIGFkZENvcnNPcHRpb25zKGFwaVJvb3QpO1xuICAgIGFkZENvcnNPcHRpb25zKGlkUmVzb3VyY2UpO1xuXG4gICAgYXBpUm9vdC5hZGRNZXRob2QoXCJQT1NUXCIsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGNyZWF0ZUl0ZW0pKTtcbiAgICBhcGlSb290LmFkZE1ldGhvZChcIkdFVFwiLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihyZWFkSXRlbXMpKTtcbiAgICBpZFJlc291cmNlLmFkZE1ldGhvZChcIkdFVFwiLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihyZWFkSXRlbXMpKTtcbiAgICBpZFJlc291cmNlLmFkZE1ldGhvZChcIlBVVFwiLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbih1cGRhdGVJdGVtKSk7XG4gICAgaWRSZXNvdXJjZS5hZGRNZXRob2QoXCJERUxFVEVcIiwgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZGVsZXRlSXRlbSkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogYXBpZ2F0ZXdheS5JUmVzb3VyY2UpIHtcbiAgYXBpUmVzb3VyY2UuYWRkTWV0aG9kKFxuICAgIFwiT1BUSU9OU1wiLFxuICAgIG5ldyBhcGlnYXRld2F5Lk1vY2tJbnRlZ3JhdGlvbih7XG4gICAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogXCIyMDBcIixcbiAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIFwibWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6XG4gICAgICAgICAgICAgIFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICBcIm1ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiJyonXCIsXG4gICAgICAgICAgICBcIm1ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIjogXCInZmFsc2UnXCIsXG4gICAgICAgICAgICBcIm1ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUnXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBhcGlnYXRld2F5LlBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXG4gICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiAne1wic3RhdHVzQ29kZVwiOiAyMDB9JyxcbiAgICAgIH0sXG4gICAgfSksXG4gICAge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiBcIjIwMFwiLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgXCJtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCI6IHRydWUsXG4gICAgICAgICAgICBcIm1ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9XG4gICk7XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCB0YWJsZU5hbWUgPSBhcHAubm9kZS50cnlHZXRDb250ZXh0KFwidGFibGVOYW1lXCIpO1xuY29uc3QgcGFydGl0aW9uS2V5TmFtZSA9IGFwcC5ub2RlLnRyeUdldENvbnRleHQoXCJwYXJ0aXRpb25LZXlOYW1lXCIpO1xuY29uc29sZS5sb2coXCJ0YWJsZW5hbWU6IFwiICsgdGFibGVOYW1lICsgXCIgcGFydGl0b2luS2V5OiBcIiArIHBhcnRpdGlvbktleU5hbWUpO1xubmV3IFJlc3RBcGlDcnVkTGFtYmRhRHluYW1vREIoYXBwLCBcIlJlc3RBcGlDcnVkTGFtYmRhRHluYW1vREJcIiwgdGFibGVOYW1lLCBwYXJ0aXRpb25LZXlOYW1lKTtcbmFwcC5zeW50aCgpO1xuIl19