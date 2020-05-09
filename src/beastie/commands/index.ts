// import { startRaidTeam, joinRaidTeam } from "./raid";
const commandModules = [
  require("./greetings"),
  require("./rawr"),
  require("./awesomeness/awesomeness"),
  require("./informational/about"),
  require("./informational/discord"),
  require("./informational/twitch")
];
const subscriberCommandModules = [];
const moderatorCommandModules = [];
const broadcasterCommandModules = [
  require("./awesomeness/bonusall"),
  require("./awesomeness/bonus")
];

export const determineCommand = (command, rank) => {
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
    if (rank.includes("moderator") || rank.includes("Moderator"))
      module = moderatorCommandModules.find(
        module => module.command === command || module.aliases.has(command)
      );
    if (module !== undefined) return module;
    if (rank.includes("broadcaster") || rank.includes("Talima"))
      module = broadcasterCommandModules.find(
        module => module.command === command || module.aliases.has(command)
      );
  }

  return module;
};

export default determineCommand;
