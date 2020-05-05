import config from "../../config";

export const createTeammateTable = async db => {
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

  console.log(
    `Creating database table: "${config.DATABASE_TEAMMATE_TABLE}"...`
  );

  try {
    const data = await db.createTable(tableParams).promise();
    console.log("Created table!", data);
  } catch (error) {
    console.log("Problem creating table ...", error);
  }
};
