import config from "../../config";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { BeastieLogger } from "../../utils/Logging";

export const createTeammateTable = async (db: DynamoDB) => {
  const tableParams = {
    TableName: config.DATABASE_TEAMMATE_TABLE,
    KeySchema: [{ AttributeName: "twitchUserId", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "twitchUserId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  };

  BeastieLogger.info(
    `Creating database table: "${config.DATABASE_TEAMMATE_TABLE}"...`
  );

  try {
    const data = await db.createTable(tableParams).promise();
    BeastieLogger.warn("Created table!", data);
  } catch (error) {
    BeastieLogger.error("Problem creating table ...", error);
  }
};
