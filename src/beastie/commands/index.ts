import config from "../../config";
export const commandModules = [
  require("./utils/help"),
  require("./hello"),
  require("./rawr"),
  require("./awesomeness/awesomeness"),
  require("./informational/about"),
  require("./informational/discord"),
  require("./informational/twitch")
];
export const subscriberCommandModules = [];
export const moderatorCommandModules = [require("./utils/alias")];
export const broadcasterCommandModules = [
  require("./awesomeness/bonusall"),
  require("./awesomeness/bonus")
];

export function getCommandModules(rank) {
  let modules = Array.from(commandModules, module => module.command);

  if (!rank) {
    return modules;
  }

  if (rank.includes("subscriber") || rank.includes("Beastie"))
    modules = modules.concat(
      Array.from(subscriberCommandModules, module => module.command)
    );
  if (rank.includes("moderator") || rank.includes("Moderator"))
    modules = modules.concat(
      Array.from(moderatorCommandModules, module => module.command)
    );
  if (rank.includes("broadcaster") || rank.includes("Talima"))
    modules = modules.concat(
      Array.from(broadcasterCommandModules, module => module.command)
    );

  return modules;
}

export const determineCommand = (
  command,
  rank,
  discordUserId: string = null
) => {
  command = command.toLowerCase();

  let module = commandModules.find(
    module => module.command === command || module.aliases.has(command)
  );
  if (module !== undefined) return module;

  if (rank) {
    if (rank.includes("subscriber") || rank.includes("Beastie"))
      module = subscriberCommandModules.find(
        module => module.command === command || module.aliases.has(command)
      );
    if (module !== undefined) return module;
    if (
      rank.includes("moderator") ||
      rank.includes("Moderator") ||
      discordUserId == config.DISCORD_GUILD_MASTER_ID
    )
      module = moderatorCommandModules.find(
        module => module.command === command || module.aliases.has(command)
      );
    if (module !== undefined) return module;
    if (
      rank.includes("broadcaster") ||
      rank.includes("Talima") ||
      discordUserId == config.DISCORD_GUILD_MASTER_ID
    )
      module = broadcasterCommandModules.find(
        module => module.command === command || module.aliases.has(command)
      );
  }

  return module;
};

export default determineCommand;
