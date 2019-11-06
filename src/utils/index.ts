import rp from "request-promise";
import R = require("ramda");
import config from "../config";
import db from "../db";
import { DynamoDB } from "aws-sdk";

export const isBroadcaster = name => {
  return name === config.BROADCASTER_USERNAME;
};

export const isStreaming = async () => {
  const streamInfo = await rp({
    uri: `https://api.twitch.tv/helix/streams?first=1&user_id=${
      config.BROADCASTER_USERNAME
    }`,
    headers: {
      "Client-ID": config.CLIENT_ID
    },
    json: true
  });

  const live =
    streamInfo.data[0] && streamInfo.data[0].type === "live" ? true : false;

  return live;
};

export const getBroadcasterId = async broadcasterUsername => {
  const usersArray = await rp({
    uri: "https://api.twitch.tv/helix/users",
    qs: { login: broadcasterUsername },
    headers: {
      "Client-ID": `${config.CLIENT_ID}`
    },
    json: true
  });
  return usersArray.data[0].id;
};

const concatAllChatters = R.pipe(
  R.values,
  R.reduce(R.concat)([]),
  R.uniq
);

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

export const updateChattersAwesomeness = async amount => {
  const { chatters } = await rp({
    uri: `https://tmi.twitch.tv/group/user/${
      config.BROADCASTER_USERNAME
    }/chatters`,
    headers: {
      "Client-ID": config.CLIENT_ID
    },
    json: true
  });

  const usernames: Array<string> = concatAllChatters(chatters);

  //const result: Array<DynamoDB.UpdateItemOutput> = await Promise.all(
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
  //result.map(u => console.log(u.Attributes))
  console.log(
    `FREE AWESOMENESS: ${
      usernames.length
    } teammates recieved ${amount} awesomeness`
  );
};
