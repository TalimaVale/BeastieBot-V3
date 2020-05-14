import rp from "request-promise";
import config from "../config";
import { awesomenessInterval } from "./values";
import dynamoDB from "../services/db";
import { createTeammateTable } from "../services/db/createTable";

export const isGuildMaster = name => {
  return name === config.DISCORD_GUILD_MASTER_USERNAME;
};

export const isBroadcaster = name => {
  return name === config.BROADCASTER_USERNAME;
};

const getUser = async username => {
  username = username.toLowerCase();

  const userArray = await rp({
    uri: "https://api.twitch.tv/helix/users",
    qs: { login: username },
    headers: {
      "Client-ID": `${config.CLIENT_ID}`,
      Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
    },
    json: true
  });
  return userArray;
};

export const getBroadcasterId = async () => {
  const userArray = await getUser(config.BROADCASTER_USERNAME);
  return userArray.data[0].id;
};

export const getBroadcasterDisplayName = async () => {
  const userArray = await getUser(config.BROADCASTER_USERNAME);
  return userArray.data[0].display_name;
};

const getBroadcasterStream = async broadcasterID => {
  const stream = await rp({
    uri: `https://api.twitch.tv/helix/streams?first=1&user_id=${broadcasterID}`,
    headers: {
      "Client-ID": config.CLIENT_ID,
      Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
    },
    json: true
  });
  return stream;
};

export const initStream = async () => {
  const broadcasterID = await getBroadcasterId();
  const stream = await getBroadcasterStream(broadcasterID);

  const live = stream.data[0] && stream.data[0].type === "live" ? true : false;
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
  const { chatters = {} } = await rp({
    uri: `https://tmi.twitch.tv/group/user/${
      config.BROADCASTER_USERNAME
    }/chatters`,
    headers: {
      "Client-ID": config.CLIENT_ID,
      Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
    },
    json: true
  });

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
    const { data: profiles = [] } = await rp({
      uri: `https://api.twitch.tv/helix/users?${query}`,
      headers: {
        "Client-ID": config.CLIENT_ID,
        Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
      },
      json: true
    });

    viewers.push(...profiles.map(({ id, login: username }) => [id, username]));
  }

  return viewers;
};

const checkDatabaseTables = async table => {
  const { TableNames = [] } = await dynamoDB.listTables().promise();
  return TableNames.includes(table);
};

const checkTeammateTable = async () => {
  const teammateTableExists = await checkDatabaseTables(
    config.DATABASE_TEAMMATE_TABLE
  );

  if (!teammateTableExists) await createTeammateTable(dynamoDB);
};

export const readAwesomeness = async (user, displayName) => {
  checkTeammateTable();

  const { data } = await getUser(user);

  if (data[0]) {
    const { id, display_name: userDisplayName } = data[0];

    const dbItem: any = await dynamoDB
      .getItem(requestReadAwesomeness(id))
      .promise();

    if (dbItem.Item) {
      const awesomeness = dbItem.Item.awesomeness.N;
      const userRead =
        userDisplayName === displayName ? `You have` : `${userDisplayName} has`;

      return `${displayName}, ${userRead} ${awesomeness} awesomeness`;
    } else return `I cannot find that teammate...`;
  } else return `I cannot find that username...`;
};

export const updateTeammateAwesomeness = async (user, amount) => {
  checkTeammateTable();

  const { data } = await getUser(user);

  if (data[0]) {
    const { id, login: username, display_name: displayName } = data[0];

    await dynamoDB
      .updateItem(requestAddAwesomeness(id, username, amount))
      .promise();

    console.log(`AWESOMENESS: ${displayName} received ${amount} awesomeness`);
    return `Awarded ${displayName} ${amount} Awesomeness!`;
  } else return `I cannot find that username...`;
};

export const updateChattersAwesomeness = async amount => {
  checkTeammateTable();

  const viewers = await getChatroomViewers();
  console.log(viewers);

  if (viewers) {
    await Promise.all(
      viewers.map(([id, username]) =>
        dynamoDB
          .updateItem(requestAddAwesomeness(id, username, amount))
          .promise()
      )
    );

    console.log(
      `AWESOMENESS: ${viewers.length} teammates received ${amount} awesomeness`
    );
    return `Awarded ${amount} Awesomeness to all stream viewers!`;
  } else return `Cannot find viewers...`;
};
