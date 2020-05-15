import rp from "request-promise";
import config from "../config";
import { awesomenessInterval } from "./values";
import dynamoDB from "../services/db";
import { createTeammateTable } from "../services/db/createTable";
import { BeastieLogger } from "./Logging";

function callTwitchApi(uri, options) {
  options = options || {};
  options.headers = {
    "Client-ID": `${config.CLIENT_ID}`,
    Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
  };
  options.json = true;
  options.uri = uri;
  return rp(options);
}

export const isGuildMaster = name => {
  return name === config.DISCORD_GUILD_MASTER_USERNAME;
};

export const isBroadcaster = name => {
  return name === config.BROADCASTER_USERNAME;
};

const getUser = async username => {
  return callTwitchApi("https://api.twitch.tv/helix/users", {
    qs: { login: username.toLowerCase() }
  });
};

export const getBroadcasterId = async () => {
  try {
    const userArray = await getUser(config.BROADCASTER_USERNAME);
    return userArray.data[0].id;
  } catch (e) {
    BeastieLogger.warn(
      `Failed to get broadcaster id for ${config.BROADCASTER_USERNAME}: ${e}`
    );
    return 0;
  }
};

export const getBroadcasterDisplayName = async () => {
  try {
    const userArray = await getUser(config.BROADCASTER_USERNAME);
    return userArray.data[0].display_name;
  } catch (e) {
    BeastieLogger.warn(
      `Failed to get broadcaster id for ${config.BROADCASTER_USERNAME}: ${e}`
    );
    return 0;
  }
};

const getBroadcasterStream = async broadcasterID => {
  return callTwitchApi(
    `https://api.twitch.tv/helix/streams?first=1&user_id=${broadcasterID}`,
    {}
  );
};

export const initStream = async () => {
  const broadcasterID = await getBroadcasterId();
  const stream = await getBroadcasterStream(broadcasterID);

  const live = stream.data[0] && stream.data[0].type === "live";
  const id = stream.data[0] && stream.data[0].id;

  return { live, id };
};

const requestAddAwesomeness = (id, username, amount) => ({
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

const getChatroomViewers = async () => {
  const { chatters = {} } = await callTwitchApi(
    `https://tmi.twitch.tv/group/user/${config.BROADCASTER_USERNAME}/chatters`,
    {}
  );

  const usernames = Object.values(chatters).flat();

  const arraysOfUsernames = usernames
    .reduce(
      ([_ = [], ...rest], username) =>
        _.length < 100 ? [[..._, username], ...rest] : [[username], _, ...rest],
      []
    )
    .reverse();

  const userIdQueryStrings = arraysOfUsernames.map(
    usernames => `login=${usernames.join("&login=")}`
  );

  let viewers = [];
  for (const query of userIdQueryStrings) {
    const { data: profiles = [] } = await callTwitchApi(
      `https://api.twitch.tv/helix/users?${query}`,
      {}
    );

    viewers.push(...profiles.map(({ id, login: username }) => [id, username]));
  }

  return viewers;
};

const checkDatabaseTables = async table => {
  const { TableNames = [] } = await dynamoDB.listTables().promise();
  return TableNames.includes(table);
};

const checkTeammateTable = async () => {
  if (!(await checkDatabaseTables(config.DATABASE_TEAMMATE_TABLE))) {
    await createTeammateTable(dynamoDB);
  }
};

export const readAwesomeness = async (user, displayName) => {
  try {
    await checkTeammateTable();
  } catch (e) {
    BeastieLogger.error(`Failed to check teammate table ${e}`);
    return;
  }

  const { data } = await getUser(user);

  if (!data[0]) {
    return `I cannot find that username...`;
  }

  const { id, display_name: userDisplayName } = data[0];

  try {
    const dbItem: any = await dynamoDB
      .getItem(requestReadAwesomeness(id))
      .promise();
    if (!dbItem.Item) {
      return `I cannot find that teammate...`;
    }

    const awesomeness = dbItem.Item.awesomeness.N;
    const userRead =
      userDisplayName === displayName ? `You have` : `${userDisplayName} has`;

    return `${displayName}, ${userRead} ${awesomeness} awesomeness`;
  } catch (e) {
    BeastieLogger.error(`Failed to fetch awesomeness from db: ${e}`);
    return `Sorry, server error`;
  }
};

export const updateTeammateAwesomeness = async (user, amount) => {
  try {
    await checkTeammateTable();
  } catch (e) {
    BeastieLogger.error(`Failed to check teammate table ${e}`);
    return `Had issue checking the TeammateTable`;
  }

  const { data } = await getUser(user);

  if (!data[0]) {
    return `I cannot find that username...`;
  }

  const { id, login: username, display_name: displayName } = data[0];

  await dynamoDB
    .updateItem(requestAddAwesomeness(id, username, amount))
    .promise();

  BeastieLogger.info(
    `AWESOMENESS: ${displayName} received ${amount} awesomeness`
  );
  return `Awarded ${displayName} ${amount} Awesomeness!`;
};

export const updateChattersAwesomeness = async amount => {
  try {
    await checkTeammateTable();
  } catch (e) {
    BeastieLogger.error(`Failed to check teammate table ${e}`);
    return;
  }

  const viewers = await getChatroomViewers();
  BeastieLogger.debug(viewers);

  if (!viewers) {
    return `Cannot find viewers...`;
  }

  await Promise.all(
    viewers.map(([id, username]) =>
      dynamoDB
        .updateItem(requestAddAwesomeness(id, username, amount))
        .promise()
        .catch(e => BeastieLogger.error(`Database error: ${e}`))
    )
  ).catch(e => {
    BeastieLogger.warn(`updateChattersAwesomeness updateDB item failed: ${e}`);
  });

  BeastieLogger.info(
    `AWESOMENESS: ${viewers.length} teammates received ${amount} awesomeness`
  );
  return `Awarded ${amount} Awesomeness to all stream viewers!`;
};
