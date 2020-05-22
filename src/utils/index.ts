import config from "../config";
import { BeastieLogger, swallowRejection } from "./Logging";
import { updateAwesomeness } from "../services/db";
import { TwitchProfile } from "../services/twitch/TwitchAPI/apiTypes";
import {
  getTwitchChatters,
  getTwitchProfile
} from "../services/twitch/TwitchAPI";
import { default as fetch, RequestInfo } from "node-fetch";

export async function PerformGetRequest<T>(
  url: RequestInfo,
  headers: object = {}
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });

  return await response.json();
}

export const isGuildMaster = name =>
  name === config.DISCORD_GUILD_MASTER_USERNAME;

export const updateTeammateAwesomeness = async (
  user,
  amount
): Promise<string> => {
  let profile: TwitchProfile = await (getTwitchProfile(user) as Promise<TwitchProfile>)
    .catch(swallowRejection(`Failed to get twitch profile for ${user}`, BeastieLogger.warn));

  if (!profile) {
    return `I cannot find that username...`;
  }

  if (!(await updateAwesomeness(profile.id, profile.login, amount))) {
    return `I failed to update the awesomeness :(`;
  }

  BeastieLogger.info(
    `AWESOMENESS: ${profile.display_name} received ${amount} awesomeness`
  );
  return `Awarded ${profile.display_name} ${amount} Awesomeness!`;
};

export const updateChattersAwesomeness = async (
  amount: number
): Promise<string> => {
  if (isNaN(amount)) {
    return `I don't think that is a number o.o`;
  }

  let viewers: TwitchProfile[] = await (getTwitchChatters(config.BROADCASTER_USERNAME) as Promise<TwitchProfile[]>)
    .catch(swallowRejection("Failed to get chatroom viewers", BeastieLogger.warn));
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
