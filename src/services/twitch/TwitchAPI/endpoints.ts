import {
  TwitchChatters,
  TwitchChattersReturnData,
  TwitchProfile,
  TwitchStream,
  TwitchStreamsReturnData,
  TwitchUsersReturnData,
  TwitchErrorResponse
} from "./apiTypes";
import config from "../../../config";
import { performGetRequest } from "../../../utils";

async function callTwitchApi<T>(uri, headers = {}): Promise<T> {
  let httpHeaders = {
    ...{
      "Content-Type": "application/json",
      "Client-ID": `${config.CLIENT_ID}`,
      Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
    },
    ...headers
  };
  const response = await performGetRequest<T | TwitchErrorResponse>(
    uri,
    httpHeaders
  );
  if (typeof (response as TwitchErrorResponse).error == "string")
    return Promise.reject(response as TwitchErrorResponse);
  else return response as T;
}

export const helixUsers = async (query: string): Promise<TwitchProfile[]> => {
  const response = await callTwitchApi<TwitchUsersReturnData>(
    `https://api.twitch.tv/helix/users?${query}`
  );
  return response.data;
};

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
