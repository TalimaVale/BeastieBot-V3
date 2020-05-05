import AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  // @ts-ignore
  endpoint: "https://dynamodb.us-west-2.amazonaws.com" // "http://localhost:8000"
});

const dynamoDB = new AWS.DynamoDB();

export default dynamoDB;
