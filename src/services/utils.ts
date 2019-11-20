import rp from "request-promise";
import config from "../config";

export const getStream = async username => {
  const stream = await rp({
    uri: `https://api.twitch.tv/helix/streams?first=1&user_id=${username}`,
    headers: {
      "Client-ID": config.CLIENT_ID
    },
    json: true
  });
  return stream;
};

export const getUser = async username => {
  const userArray = await rp({
    uri: "https://api.twitch.tv/helix/users",
    qs: { login: username },
    headers: {
      "Client-ID": `${config.CLIENT_ID}`
    },
    json: true
  });
  return userArray;
};

export const getChatroomViewers = async () => {
  const { chatters } = await rp({
    uri: `https://tmi.twitch.tv/group/user/${
      config.BROADCASTER_USERNAME
    }/chatters`,
    headers: {
      "Client-ID": config.CLIENT_ID
    },
    json: true
  });
  return chatters;
};
