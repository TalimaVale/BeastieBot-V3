import rp from "request-promise";
import config from "../config";
import { BeastieLogger } from "./Logging";
import { updateAwesomeness } from "../services/db";

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

export const getTwitchId = async (username: string): Promise<string> => {
  try {
    let user = await getUser(username);
    return user.data[0].id;
  } catch (e) {
    BeastieLogger.warn(`Failed to get user ${username}'s id: ${e}`);
  }
  return null;
};

export const getBroadcasterId = async (): Promise<string> => {
  return getTwitchId(config.BROADCASTER_USERNAME);
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

interface ChattersData {
  broadcaster?: string[];
  vips?: string[];
  moderators: string[];
  staff: string[];
  admins: string[];
  global_mods: string[];
  viewers: string[];
}

const getChatroomViewers = async (): Promise<string[]> => {
  let chatters: ChattersData;
  try {
    chatters = (
      await callTwitchApi(
        `https://tmi.twitch.tv/group/user/${config.BROADCASTER_USERNAME}/chatters`,
        {}
      )
    ).chatters;
  } catch (e) {
    BeastieLogger.warn(`Failed to get chatroom viewers: ${e}`);
    return [];
  }

  const usernames: string[] = Object.values(chatters).flat();

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

  let viewers: string[] = [];
  for (const query of userIdQueryStrings) {
    try {
      const { data: profiles = [] } = await callTwitchApi(
        `https://api.twitch.tv/helix/users?${query}`,
        {}
      );

      viewers.push(
        ...profiles.map(({ id, login: username }) => [id, username])
      );
    } catch (e) {
      BeastieLogger.warn(`Failed to fetch twitch user ${query}`);
    }
  }

  return viewers;
};

export const updateTeammateAwesomeness = async (user, amount) => {
  const { data } = await getUser(user);

  if (!data[0]) {
    return `I cannot find that username...`;
  }

  const { id, login: username, display_name: displayName } = data[0];

  if (!(await updateAwesomeness(id, username, amount))) {
    return `I failed to update the awesomeness :(`;
  }

  BeastieLogger.info(
    `AWESOMENESS: ${displayName} received ${amount} awesomeness`
  );
  return `Awarded ${displayName} ${amount} Awesomeness!`;
};

export const updateChattersAwesomeness = async amount => {
  let viewers: string[];
  try {
    viewers = await getChatroomViewers();
  } catch (e) {
    BeastieLogger.warn(`Failed to get chatroom viewers!`);
    return;
  }
  BeastieLogger.debug(`Current viewers: ${viewers}`);

  if (!viewers) {
    return `Cannot find viewers...`;
  }

  await Promise.allSettled(
    viewers.map(([id, username]) => updateAwesomeness(id, username, amount))
  );

  BeastieLogger.info(
    `AWESOMENESS: ${viewers.length} teammates received ${amount} awesomeness`
  );
  return `Awarded ${amount} Awesomeness to all stream viewers!`;
};
