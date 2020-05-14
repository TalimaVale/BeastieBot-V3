import {
  beastieFaceTwitchEmotes,
  beastieFaceDiscordEmotes
} from "../../utils/values";
import { isBroadcaster, isGuildMaster } from "../../utils";

export const command = "hello";

export const aliases = new Set([
  `hi`,
  `hey`,
  `heyo`,
  `howdy`,
  `hellobeastie`,
  `hellottsbeastie`,
  `hibeastie`,
  `hittsbeastie`,
  `heybeastie`,
  `heyttsbeastie`,
  `heyobeastie`,
  `heyottsbeastie`,
  `howdybeastie`,
  `howdyttsbeastie`
]);

export const execute = ({ platform, message, username, displayName }) => {
  let beastieGreeting = "Hello";
  if (message.toLowerCase().substring(1, 3) === "hi") beastieGreeting = "Hi";
  else if (message.toLowerCase().substring(1, 4) === "hey")
    beastieGreeting = "Hey";

  let beastieEmote;
  if (isBroadcaster(username)) beastieEmote = "OhMyDog";
  else if (isGuildMaster(username)) beastieEmote = ":dragon:";
  else
    beastieEmote =
      platform === "twitch"
        ? beastieFaceTwitchEmotes[
            Math.floor(Math.random() * beastieFaceTwitchEmotes.length)
          ]
        : beastieFaceDiscordEmotes[
            Math.floor(Math.random() * beastieFaceDiscordEmotes.length)
          ];

  return `${beastieGreeting} ${displayName}! ${beastieEmote}`;
};
