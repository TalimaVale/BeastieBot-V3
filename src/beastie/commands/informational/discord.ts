import { CommandModule } from "../index";
import CommandContext from "../utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  return context.platform === "twitch"
    ? `Join the Team Discord Guild! ⠀⠀⠀ => https://discord.gg/eZtrhh7`
    : `Join the Team Discord Guild!\n=> https://discord.gg/eZtrhh7`;
};

const cmdModule = new CommandModule("discord", new Set([]), execute);
export default cmdModule;
