import rp from "request-promise";
import R = require("ramda");
import config from "../config";
import db from "../services/db";

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

const getBroadcasterStream = async () => {
  const stream = await rp({
    uri: `https://api.twitch.tv/helix/streams?first=1&user_id=${
      config.BROADCASTER_USERNAME
    }`,
    headers: {
      "Client-ID": config.CLIENT_ID
    },
    json: true
  });
  return stream;
};

export const initStream = async () => {
  const stream = await getBroadcasterStream();

  const live = stream.data[0] && stream.data[0].type === "live" ? true : false;
  const id = stream.data[0] && stream.data[0].id;

  return { live, id };
};

const updateAwesomenessRequest = (username, amount) => ({
  Key: {
    username: {
      S: username
    }
  },
  TableName: config.DATABASE_TEAMMATE_TABLE,
  ExpressionAttributeNames: {
    "#A": "awesomeness"
  },
  ExpressionAttributeValues: {
    ":A": {
      N: `${amount}`
    }
  },
  UpdateExpression: "ADD #A :A",
  ReturnValues: "ALL_NEW"
});

const concatAllChatters = R.pipe(
  R.values,
  R.reduce(R.concat)([]),
  R.uniq
);

const getChatroomViewers = async () => {
  const chatters = await rp({
    uri: `https://tmi.twitch.tv/group/user/${
      config.BROADCASTER_USERNAME
    }/chatters`,
    headers: {
      "Client-ID": config.CLIENT_ID
    },
    json: true
  });
  return { chatters };
};

export const updateChattersAwesomeness = async amount => {
  const chatters = await getChatroomViewers();
  const usernames: Array<string> = concatAllChatters(chatters);

  await Promise.all(
    usernames
      .map(u => updateAwesomenessRequest(u, amount))
      .map(
        req =>
          new Promise((resolve, reject) => {
            db.updateItem(req, (err, result) =>
              err ? reject(err) : resolve(result)
            );
          })
      )
  );
  console.log(
    `AWESOMENESS: ${usernames.length} teammates recieved ${amount} awesomeness`
  );
};
