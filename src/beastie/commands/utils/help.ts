import { getCommandModules } from "../index";

export const command = "help";

export const aliases = new Set(["?", "hlp", "commands", "cmds", "h"]);

const maxCommandsPerPage = 5;

export const execute = ({ roles, para1 = 1 }) => {
  let cmds = getCommandModules(roles);
  if (!cmds.length) {
    return 0;
  }

  // -1 to make it easier for users (1-10, easier for most than 0-9)
  para1 = isNaN(para1) ? 0 : Math.floor(+para1 - 1);

  const page = Math.max(para1, 0);
  const maxPages = Math.ceil(cmds.length / maxCommandsPerPage);
  const startIndex = page * maxCommandsPerPage;

  if (startIndex >= cmds.length) {
    return `You only have ${maxPages} pages of help`;
  }

  let commandList = cmds
    .slice(startIndex, startIndex + maxCommandsPerPage)
    .join(", ");
  let output = `Commands: ${commandList} - page ${page + 1}/${maxPages}`;

  // Twitch has a max message length of 500 - https://discuss.dev.twitch.tv/t/irc-bot-and-message-lengths/23327
  return output.slice(0, 500);
};
