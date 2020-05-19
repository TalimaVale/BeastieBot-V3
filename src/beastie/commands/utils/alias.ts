import {
  commandModules,
  subscriberCommandModules,
  moderatorCommandModules,
  broadcasterCommandModules,
  CommandModule
} from "../index";
import CommandContext from "./commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  let commandModule: CommandModule;
  let allModules: CommandModule[] = commandModules.concat(
    subscriberCommandModules,
    moderatorCommandModules,
    broadcasterCommandModules
  );

  for (const module of allModules) {
    if (module.name === context.para2 || module.aliases.has(context.para2)) {
      return `Command "${context.para2}" is already defined!`;
    }
    if (module.name === context.para1 || module.aliases.has(context.para1)) {
      commandModule = module;
    }
  }

  if (commandModule !== undefined) {
    commandModule.aliases.add(context.para2);
    return `Added alias of "${context.para2}" to ${commandModule.name} command.`;
  } else {
    return `Could not find "${context.para1}" command.`;
  }
};

const cmdModule = new CommandModule("alias", new Set([]), execute);
export default cmdModule;
