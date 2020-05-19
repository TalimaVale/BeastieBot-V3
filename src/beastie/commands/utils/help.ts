import { getCommandModules, CommandModule } from "../index";
import CommandContext from "./commandContext";

const maxCommandsPerPage = 5;

const execute = async (context: CommandContext): Promise<string> => {
  let cmds = getCommandModules(context.roles);
  if (!cmds.length) {
    return "";
  }

  // -1 to make it easier for users (1-10, easier for most than 0-9)
  let para1 = isNaN(+context.para1) ? 0 : Math.floor(+context.para1 - 1);

  const page = Math.max(para1, 0);
  const maxPages = Math.ceil(cmds.length / maxCommandsPerPage);
  const startIndex = page * maxCommandsPerPage;

  if (startIndex >= cmds.length) {
    return `You only have ${maxPages} pages of help`;
  }

  let commandList = Array.from(cmds, (cmd: CommandModule) => cmd.name)
    .slice(startIndex, startIndex + maxCommandsPerPage)
    .join(", ");
  let output = `Commands: ${commandList} - page ${page + 1}/${maxPages}`;

  // Twitch has a max message length of 500 - https://discuss.dev.twitch.tv/t/irc-bot-and-message-lengths/23327
  return output.slice(0, 500);
};

const cmdModule = new CommandModule(
  "help",
  new Set(["?", "hlp", "commands", "cmds", "h"]),
  execute
);
export default cmdModule;
