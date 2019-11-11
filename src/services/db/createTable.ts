import config from "../../config";

export const createTeammateTable = db => {
  const tableParams = {
    TableName: config.DATABASE_TEAMMATE_TABLE,
    KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  };

  console.log(
    `Creating database table: "${config.DATABASE_TEAMMATE_TABLE}"...`
  );
  db.createTable(tableParams, (err, data) => {
    if (err)
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    else
      console.log(
        "Created table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
  });
};
