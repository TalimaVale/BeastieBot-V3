import R = require("ramda");
import config from "../config";
import db from "../services/db";
import {
  getBroadcaster,
  getBroadcasterStream,
  getChatroomViewers
} from "../services/utils";

export const isBroadcaster = name => {
  return name === config.BROADCASTER_USERNAME;
};

export const getBroadcasterId = async () => {
  const userArray = await getBroadcaster();
  return userArray.data[0].id;
};

export const getBroadcasterDisplayName = async () => {
  const userArray = await getBroadcaster();
  return userArray.data[0].display_name;
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

export const updateChattersAwesomeness = async amount => {
  const chatters = await getChatroomViewers();
  const usernames = concatAllChatters(chatters);

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

// ADD AWESOMENESS CHECK COMMAND
