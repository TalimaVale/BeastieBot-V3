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

type TwitchProfile = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
};

let twitchProfileCache = new Map<string, TwitchProfile>();

function addProfileToCache(
  username: string,
  profile: TwitchProfile
): TwitchProfile {
  if (twitchProfileCache.has(username)) {
    return profile;
  }
  twitchProfileCache.set(username, profile);
  setTimeout(() => twitchProfileCache.delete(username), 1000 * 60 * 60 * 24);
  return profile;
}

const getTwitchProfile = async (username: string): Promise<TwitchProfile> => {
  if (twitchProfileCache.has(username)) {
    return twitchProfileCache.get(username);
  }

  try {
    const {
      data: [profile = null]
    } = await callTwitchApi("https://api.twitch.tv/helix/users", {
      qs: { login: username.toLowerCase() }
    });
    return addProfileToCache(username, profile);
  } catch (e) {
    BeastieLogger.warn(`Failed to get twitch user ${username}: ${e}`);
  }

  return null;
};

export const getTwitchId = async (username: string): Promise<string> => {
  let user = await getTwitchProfile(username);
  return user?.id;
};

export const getBroadcasterId = async (): Promise<string> => {
  return getTwitchId(config.BROADCASTER_USERNAME);
};

export const getBroadcasterDisplayName = async () => {
  const userArray = await getTwitchProfile(config.BROADCASTER_USERNAME);
  return userArray?.display_name;
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

type ChattersData = {
  broadcaster?: string[];
  vips?: string[];
  moderators: string[];
  staff: string[];
  admins: string[];
  global_mods: string[];
  viewers: string[];
};

async function getTwitchProfiles(usernames: string[]) {
  let twitchProfiles: TwitchProfile[] = [];

  usernames = usernames.filter((username: string): boolean => {
    if (!twitchProfileCache.has(username)) {
      return true;
    }

    twitchProfiles.push(twitchProfileCache.get(username));
    return false;
  });

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

  for (const query of userIdQueryStrings) {
    try {
      const { data: profiles = [] } = await callTwitchApi(
        `https://api.twitch.tv/helix/users?${query}`,
        {}
      );

      profiles.forEach((profile: TwitchProfile) => {
        twitchProfiles.push(addProfileToCache(profile.login, profile));
      });
    } catch (e) {
      BeastieLogger.warn(`Failed to fetch twitch user ${query}`);
    }
  }
  return twitchProfiles;
}

const getChatroomViewers = async (): Promise<TwitchProfile[]> => {
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

  return getTwitchProfiles(Object.values(chatters).flat());
};

export const updateTeammateAwesomeness = async (user, amount) => {
  const twitchUser = await getTwitchProfile(user);

  if (!twitchUser) {
    return `I cannot find that username...`;
  }

  if (!(await updateAwesomeness(twitchUser.id, twitchUser.login, amount))) {
    return `I failed to update the awesomeness :(`;
  }

  BeastieLogger.info(
    `AWESOMENESS: ${twitchUser.display_name} received ${amount} awesomeness`
  );
  return `Awarded ${twitchUser.display_name} ${amount} Awesomeness!`;
};

export const updateChattersAwesomeness = async amount => {
  let viewers: TwitchProfile[];
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
    viewers.map((profile: TwitchProfile) =>
      updateAwesomeness(profile.id, profile.login, amount)
    )
  );

  BeastieLogger.info(
    `AWESOMENESS: ${viewers.length} teammates received ${amount} awesomeness`
  );
  return `Awarded ${amount} Awesomeness to all stream viewers!`;
};
