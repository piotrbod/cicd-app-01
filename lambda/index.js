const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
      ':employerId': employerId,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise();
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
