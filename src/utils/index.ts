import rp from "request-promise";
import R = require("ramda");
import config from "../config";
import db from "../services/db";
import { createTeammateTable } from "../services/db/createTable";
import dynamoDB from "../services/db";

export const isBroadcaster = name => {
  return name === config.BROADCASTER_USERNAME;
};

const getBroadcaster = async () => {
  const userArray = await rp({
    uri: "https://api.twitch.tv/helix/users",
    qs: { login: config.BROADCASTER_USERNAME },
    headers: {
      "Client-ID": `${config.CLIENT_ID}`
    },
    json: true
  });
  return userArray;
};

export const getBroadcasterId = async () => {
  const userArray = await getBroadcaster();
  return userArray.data[0].id;
};

export const getBroadcasterDisplayName = async () => {
  const userArray = await getBroadcaster();
  return userArray.data[0].display_name;
};

const getBroadcasterStream = async broadcasterID => {
  const stream = await rp({
    uri: `https://api.twitch.tv/helix/streams?first=1&user_id=${broadcasterID}`,
    headers: {
      "Client-ID": config.CLIENT_ID
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
    "#UN": "username"
  },
  ExpressionAttributeValues: {
    ":A": {
      N: `${amount}`
    },
    ":UN": {
      S: username
    }
  },
  UpdateExpression: "ADD #A :A SET #UN = :UN",
  ReturnValues: "ALL_NEW"
});

const getChatroomViewers = async () => {
  const { chatters = {} } = await rp({
    uri: `https://tmi.twitch.tv/group/user/${
      config.BROADCASTER_USERNAME
    }/chatters`,
    headers: {
      "Client-ID": config.CLIENT_ID
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
        "Client-ID": config.CLIENT_ID
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

export const updateChattersAwesomeness = async amount => {
  const teammateTableExists = await checkDatabaseTables(
    config.DATABASE_TEAMMATE_TABLE
  );

  if (!teammateTableExists) await createTeammateTable(db);

  const viewers = await getChatroomViewers();
  console.log(viewers);

  await Promise.all(
    viewers.map(([id, username]) =>
      db.updateItem(requestAddAwesomeness(id, username, amount)).promise()
    )
  );

  console.log(
    `AWESOMENESS: ${viewers.length} teammates received ${amount} awesomeness`
  );
};
