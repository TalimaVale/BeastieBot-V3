import AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  // @ts-ignore
  endpoint: "http://localhost:8000" //'https://dynamodb.us-west-2.amazonaws.com'
});

const dynamoDB = new AWS.DynamoDB();

export default dynamoDB;
