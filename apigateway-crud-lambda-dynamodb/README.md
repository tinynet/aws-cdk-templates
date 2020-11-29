# APIGateway CRUD on DynamoDB implemented with Lambda (Nodejs)

This CloudFormation template build API for CRUD operations on a DynamoDB table.

API are created with APIGateway and REST API.

CRUD operations are implemented with lambda functions in Node.js

Code formatted with Prittier automatically.

@TODO: HTTP API are newer https://www.learnaws.org/2020/09/12/rest-api-vs-http-api/
@TODO: uuid import broken...

## Build

Need aws-cdk installed globally or locally and typescript.

Install dependencies and run typescript:

```bash
npm install
npm run build
```

To compile on changes automatically:

```bash
npm run watch
```

Generate CloudFormation template in cdk.out directory

    $ cdk synth -c tableName=products -c partitionKeyName=productId

Deploy need bootstrapping:
(https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)

    $ cdk bootstrap  aws://account-id/region -c tableName=products -c partitionKeyName=productId

    $ cdk deploy -c tableName=products -c partitionKeyName=productId
