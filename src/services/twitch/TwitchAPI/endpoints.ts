import {
  TwitchChatters,
  TwitchChattersReturnData,
  TwitchProfile,
  TwitchStream,
  TwitchStreamsReturnData,
  TwitchUsersReturnData
} from "./apiTypes";
import config from "../../../config";
import { performGetRequest } from "../../../utils";

function callTwitchApi<T>(uri, headers = {}): Promise<T> {
  let httpHeaders = {
    ...{
      "Content-Type": "application/json",
      "Client-ID": `${config.CLIENT_ID}`,
      Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
    },
    ...headers
  };
  return performGetRequest<T>(uri, httpHeaders);
}

export const helixUsers = async (query: string): Promise<TwitchProfile[]> =>
  (
    await callTwitchApi<TwitchUsersReturnData>(
      `https://api.twitch.tv/helix/users?${query}`
    )
  ).data;

export const helixStreams = async (query: string): Promise<TwitchStream[]> =>
  (
    await callTwitchApi<TwitchStreamsReturnData>(
      `https://api.twitch.tv/helix/streams?${query}`
    )
  ).data;

export const tmiChatters = async (streamer: string): Promise<TwitchChatters> =>
  (
    await callTwitchApi<TwitchChattersReturnData>(
      `https://tmi.twitch.tv/group/user/${streamer}/chatters`
    )
  ).chatters;
