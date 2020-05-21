import { TwitchChattersData, TwitchProfile, TwitchStreams } from "./apiTypes";
import config from "../../../config";
import { PerformHttpRequest } from "../../../utils";

function callTwitchApi<T>(uri, options = null): Promise<T> {
  options = options || {};
  options.headers = {
    "Client-ID": `${config.CLIENT_ID}`,
    Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
  };
  options.json = true;
  return PerformHttpRequest<T>(uri, options);
}

export async function helixUsers(query: string): Promise<TwitchProfile[]> {
  return callTwitchApi<TwitchProfile[]>(
    `https://api.twitch.tv/helix/users?${query}`
  );
}

export async function helixStreams(query: string): Promise<TwitchStreams> {
  return callTwitchApi(`https://api.twitch.tv/helix/streams?${query}`);
}

export async function tmiChatters(
  streamer: string
): Promise<TwitchChattersData> {
  return callTwitchApi<TwitchChattersData>(
    `https://tmi.twitch.tv/group/user/${streamer}/chatters`
  );
}
