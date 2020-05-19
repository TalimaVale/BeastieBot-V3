import { CommandModule } from "../index";
import CommandContext from "../utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  return context.platform === "twitch"
    ? `Join the Team Stream! ⠀⠀⠀⠀⠀⠀⠀ => https://twitch.tv/teamTALIMA`
    : `Join the Team Stream!\n=> https://twitch.tv/teamTALIMA`;
};

const cmdModule = new CommandModule("twitch", new Set([]), execute);
export default cmdModule;
