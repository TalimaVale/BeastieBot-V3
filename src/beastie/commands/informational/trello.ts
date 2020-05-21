import { CommandModule } from "../index";

const execute = async (): Promise<string> => {
  return `Check out the beastie trello => https://trello.com/b/WEzOBz2t/beastiebot`;
};

const cmdModule = new CommandModule("trello", new Set([]), execute);
cmdModule.rateLimit = 1000 * 60 * 10;
export default cmdModule;
