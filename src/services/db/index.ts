import AWS = require("aws-sdk");
import config from "../../config";
import { awesomenessInterval } from "../../utils/values";
import { BeastieLogger } from "../../utils/Logging";
import DynamoDB from "aws-sdk/clients/dynamodb";

AWS.config.update({
  region: "us-west-2",
  // @ts-ignore
  endpoint: config.AWS_ENDPOINT
});

const dynamoDB = new AWS.DynamoDB();

const createTeammateTable = async (db: DynamoDB) => {
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

const requestAddAwesomeness = (
  id: string,
  username: string,
  amount: number
) => ({
  Key: {
    twitchUserId: {
      S: id
    }
  },
  TableName: config.DATABASE_TEAMMATE_TABLE,
  ExpressionAttributeNames: {
    "#A": "awesomeness",
    "#UN": "username",
    "#WT": "watchTime"
  },
  ExpressionAttributeValues: {
    ":A": {
      N: `${amount}`
    },
    ":UN": {
      S: username
    },
    ":WT": {
      N: `${awesomenessInterval / 60 / 1000}`
    }
  },
  UpdateExpression: "ADD #A :A, #WT :WT SET #UN = :UN",
  ReturnValues: "ALL_NEW"
});

const requestReadAwesomeness = id => ({
  Key: {
    twitchUserId: {
      S: id
    }
  },
  TableName: config.DATABASE_TEAMMATE_TABLE
});

const checkDatabaseTables = async table => {
  const { TableNames = [] } = await dynamoDB.listTables().promise();
  return TableNames.includes(table);
};

export const checkTeammateTable = async (): Promise<boolean> => {
  try {
    if (!(await checkDatabaseTables(config.DATABASE_TEAMMATE_TABLE))) {
      await createTeammateTable(dynamoDB);
    }
  } catch (e) {
    BeastieLogger.error(
      `Error validating database table ${config.DATABASE_TEAMMATE_TABLE}: ${e}`
    );
    return false;
  }

  return true;
};

export const getAwesomeness = async (twitchId): Promise<number> => {
  try {
    const dbItem: any = await dynamoDB
      .getItem(requestReadAwesomeness(twitchId))
      .promise();
    return !!dbItem.Item ? dbItem.Item.awesomeness.N : 0;
  } catch (e) {
    BeastieLogger.warn(`Failed to get user ${twitchId} from db: ${e}`);
  }

  return 0;
};

export const updateAwesomeness = async (
  id,
  username,
  amount: number
): Promise<boolean> => {
  try {
    await dynamoDB
      .updateItem(requestAddAwesomeness(id, username, amount))
      .promise();
    return true;
  } catch (e) {
    BeastieLogger.warn(`Failed to update user ${id} awesomeness: ${e}`);
  }

  return false;
};
