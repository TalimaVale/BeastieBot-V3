import { CommandModule } from "./index";
import CommandContext from "./utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  return context.platform === "twitch"
    ? "teamta1RAWR teamta1RAWR"
    : "<:teamta1RAWR:704871701992702013>";
};

const cmdModule = new CommandModule("rawr", new Set([]), execute);
export default cmdModule;
