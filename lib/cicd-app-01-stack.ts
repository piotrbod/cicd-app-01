import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import path = require('path');

export class CicdApp01Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const lambdaFunction = new lambda.Function(this, 'QueryLambda', {
      runtime: lambda.Runtime.NODEJS_18_X, // Set Node.js 18 runtime
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')), // Path to your Lambda function code
      handler: 'index.handler',
      environment: {
        TABLE_NAME: 'EmployeesTable', // The name of the DynamoDB table
      },
    });

    // Grant the Lambda function read permissions on the DynamoDB table
    const table = dynamodb.Table.fromTableName(this, 'ExistingTable', 'EmployeesTable');
    table.grantReadData(lambdaFunction);

    // Create an HTTP API Gateway
    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      apiName: 'Employees HTTP API',
      description: 'API for managing employees',
    });

    // Add a route for the 'GET /employees' endpoint
    httpApi.addRoutes({
      path: '/employees',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        'LambdaIntegration',
        lambdaFunction
      ),
    });
  }
}
