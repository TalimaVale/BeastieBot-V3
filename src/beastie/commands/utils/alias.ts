import { commandModules } from "../index";
import subscriberCommandModules from "../index";
import moderatorCommandModules from "../index";
import broadcasterCommandModules from "../index";

export const command = "alias";

export const aliases = new Set([]);

export const execute = ({ para1, para2 }) => {
  let commandModule;

  for (const module of commandModules) {
    if (module.command === para2 || module.aliases.has(para2)) {
      return `Command "${para2}" is already defined!`;
    }
    if (module.command === para1 || module.aliases.has(para1)) {
      commandModule = module;
    }
  }

  if (commandModule !== undefined) {
    commandModule.aliases.add(para2);
    return `Added alias of "${para2}" to ${commandModule.command} command.`;
  } else {
    return `Could not find "${para1}" command.`;
  }
};
