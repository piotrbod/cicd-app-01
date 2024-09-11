// Import the DynamoDBClient and QueryCommand from @aws-sdk/client-dynamodb
const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');

// Create a new DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Replace with your region

exports.handler = async (event) => {
  const employerId = event.queryStringParameters && event.queryStringParameters.employerId;

  if (!employerId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'employerId query parameter is required' }),
    };
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: 'EmployerIndex', // Ensure this is the correct index name
    KeyConditionExpression: 'employerId = :employerId',
    ExpressionAttributeValues: {
      ':employerId': { S: employerId },
    },
  };

  try {
    const command = new QueryCommand(params);
    const data = await dynamoDbClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
