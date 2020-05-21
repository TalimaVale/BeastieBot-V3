// Takes in an array of usernames and converts to an array of
// queries for the twitch helix api limiting to 100 users per
// query.
import { Cache, CacheKeyValPair } from "../../../utils/cache";
import { TwitchProfile, TwitchStream } from "./apiTypes";
import { BeastieLogger } from "../../../utils/Logging";
import { helixStreams, helixUsers, tmiChatters } from "./endpoints";
import config from "../../../config";

function usernameArrayToIdQueryArray(usernames: string[]): string[] {
  const arraysOfUsernames = usernames
    .reduce(
      ([_ = [], ...rest], username) =>
        _.length < 100 ? [[..._, username], ...rest] : [[username], _, ...rest],
      []
    )
    .reverse();

  return arraysOfUsernames.map(
    usernames => `login=${usernames.join("&login=")}`
  );
}

let profileCache: Cache<TwitchProfile> = new Cache<TwitchProfile>(
  async (
    key: string | string[]
  ): Promise<TwitchProfile | CacheKeyValPair<TwitchProfile>[]> => {
    if (Array.isArray(key)) {
      let profileKeyValuePairs: CacheKeyValPair<TwitchProfile>[] = [];
      for (const query of usernameArrayToIdQueryArray(key)) {
        try {
          profileKeyValuePairs = profileKeyValuePairs.concat(
            Array.from(await helixUsers(query), profile => ({
              key: profile.login,
              val: profile
            }))
          );
        } catch (e) {
          BeastieLogger.warn(`Failed to fetch twitch user ${query}`);
        }
      }
      return profileKeyValuePairs;
    } else {
      return (await helixUsers(`login=${key}`))[0];
    }
  }
);

export async function getTwitchProfile(
  username: string
): Promise<TwitchProfile> {
  try {
    return (await profileCache.get(username)) as TwitchProfile;
  } catch (e) {
    BeastieLogger.warn(`Failed to get twitch user ${username}: ${e}`);
  }
  return null;
}

export async function getTwitchProfiles(
  usernames: string[]
): Promise<TwitchProfile[]> {
  try {
    return (await profileCache.get(usernames)) as TwitchProfile[];
  } catch (e) {
    BeastieLogger.warn(`Failed to get twitch user ${usernames}: ${e}`);
  }
  return null;
}

export const getTwitchChatters = async (
  streamer: string
): Promise<TwitchProfile[]> => {
  const chatters = (await tmiChatters(streamer)).chatters;
  return getTwitchProfiles(Object.values(chatters).flat());
};

export const isBroadcaster = (name: string) => {
  return name === config.BROADCASTER_USERNAME;
};

type Broadcaster = {
  getProfile: () => Promise<TwitchProfile>;
  getStream: () => Promise<TwitchStream>;
};

export const broadcaster: Broadcaster = {
  getProfile: async (): Promise<TwitchProfile> =>
    await getTwitchProfile(config.BROADCASTER_USERNAME),
  getStream: async (): Promise<TwitchStream> => {
    let streams = await helixStreams(
      `first=1&user_id=${(await broadcaster.getProfile())?.id}`
    );
    return streams[0];
  }
};
