import config from "../../config";
import CommandContext from "./utils/commandContext";

export class CommandModule {
  name: string;
  aliases: Set<string>;
  lastUseTime: number = Date.now();
  rateLimit: number = 0; // TODO

  constructor(
    name: string,
    aliases: Set<string>,
    payload: (context: CommandContext) => Promise<string> | Promise<void>
  ) {
    this.name = name;
    this.aliases = aliases;
    this.payload = payload;
  }

  async execute(context: CommandContext): Promise<string | void> {
    if (this.lastUseTime + this.rateLimit > Date.now()) {
      return;
    }

    this.lastUseTime = Date.now();
    return await this.payload(context);
  }
  payload: (context: CommandContext) => Promise<string | void>;
}

export const commandModules: CommandModule[] = [
  require("./utils/help").default,
  require("./hello").default,
  require("./rawr").default,
  require("./awesomeness/awesomeness").default,
  require("./informational/about").default,
  require("./informational/discord").default,
  require("./informational/twitch").default,
  require("./informational/trello").default
];
export const subscriberCommandModules: CommandModule[] = [];
export const moderatorCommandModules: CommandModule[] = [
  require("./utils/alias").default
];
export const broadcasterCommandModules: CommandModule[] = [
  require("./awesomeness/bonusall").default,
  require("./awesomeness/bonus").default
];

export function getCommandModules(rank): CommandModule[] {
  let modules = Array.from(commandModules);

  if (!rank) return modules;

  if (rank.includes("subscriber") || rank.includes("Beastie"))
    modules = modules.concat(subscriberCommandModules);
  if (rank.includes("moderator") || rank.includes("Moderator"))
    modules = modules.concat(moderatorCommandModules);
  if (rank.includes("broadcaster") || rank.includes("Talima"))
    modules = modules.concat(broadcasterCommandModules);

  return modules;
}

export const determineCommand = (
  command,
  rank,
  discordUserId: string = null
) => {
  command = command.toLowerCase();

  let module = commandModules.find(
    module => module.name === command || module.aliases.has(command)
  );
  if (module !== undefined) return module;

  if (rank) {
    if (rank.includes("subscriber") || rank.includes("Beastie"))
      module = subscriberCommandModules.find(
        module => module.name === command || module.aliases.has(command)
      );
    if (module !== undefined) return module;
    if (
      rank.includes("moderator") ||
      rank.includes("Moderator") ||
      discordUserId == config.DISCORD_GUILD_MASTER_ID
    )
      module = moderatorCommandModules.find(
        module => module.name === command || module.aliases.has(command)
      );
    if (module !== undefined) return module;
    if (
      rank.includes("broadcaster") ||
      rank.includes("Talima") ||
      discordUserId == config.DISCORD_GUILD_MASTER_ID
    )
      module = broadcasterCommandModules.find(
        module => module.name === command || module.aliases.has(command)
      );
  }

  return module;
};

export default determineCommand;
