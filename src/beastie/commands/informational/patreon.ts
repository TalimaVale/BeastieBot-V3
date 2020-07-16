import { CommandModule } from "../index";
import CommandContext from "../utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  return context.platform === "twitch"
    ? `bleedPurple Talima has a Patreon! Your support unlocks special rewards, and enables us to live stream our projects full time. Support Talima on Patreon => https://patreon.com/TalimaVale bleedPurple Thank you!`
    : `Talima has a Patreon! Your support unlocks special rewards, and enables us to live stream our projects full time. Support Talima on Patreon\n=> https://patreon.com/TalimaVale Thank you!`;
};

const cmdModule = new CommandModule("patreon", new Set([]), execute);
cmdModule.rateLimit = 1000 * 60;
export default cmdModule;
