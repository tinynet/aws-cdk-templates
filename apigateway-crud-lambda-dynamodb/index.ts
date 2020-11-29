import apigateway = require("@aws-cdk/aws-apigateway");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");

export class RestApiCrudLambdaDynamoDB extends cdk.Stack {
  constructor(app: cdk.App, id: string, tableName: string, partitionKeyName: string) {
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
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
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

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
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
    }),
    {
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
    }
  );
}

const app = new cdk.App();
const tableName = app.node.tryGetContext("tableName");
const partitionKeyName = app.node.tryGetContext("partitionKeyName");
console.log("tablename: " + tableName + " partitoinKey: " + partitionKeyName);
new RestApiCrudLambdaDynamoDB(app, "RestApiCrudLambdaDynamoDB", tableName, partitionKeyName);
app.synth();
