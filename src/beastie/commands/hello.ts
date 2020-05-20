import {
  beastieFaceTwitchEmotes,
  beastieFaceDiscordEmotes
} from "../../utils/values";
import { isBroadcaster, isGuildMaster } from "../../utils";
import { CommandModule } from "./index";
import CommandContext from "./utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  let beastieGreeting = "Hello";
  if (context.message.toLowerCase().substring(1, 3) === "hi")
    beastieGreeting = "Hi";
  else if (context.message.toLowerCase().substring(1, 4) === "hey")
    beastieGreeting = "Hey";

  let beastieEmote;
  if (isBroadcaster(context.username)) beastieEmote = "OhMyDog";
  else if (isGuildMaster(context.username)) beastieEmote = ":dragon:";
  else
    beastieEmote =
      context.platform === "twitch"
        ? beastieFaceTwitchEmotes[
            Math.floor(Math.random() * beastieFaceTwitchEmotes.length)
          ]
        : beastieFaceDiscordEmotes[
            Math.floor(Math.random() * beastieFaceDiscordEmotes.length)
          ];

  return `${beastieGreeting} ${context.displayName}! ${beastieEmote}`;
};

const cmdModule = new CommandModule(
  "hello",
  new Set([
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
  ]),
  execute
);
export default cmdModule;
