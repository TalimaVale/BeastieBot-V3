import AWS = require("aws-sdk");
import config from "../../config";

AWS.config.update({
  region: "us-west-2",
  // @ts-ignore
  endpoint: config.AWS_ENDPOINT
});

const dynamoDB = new AWS.DynamoDB();

export default dynamoDB;
