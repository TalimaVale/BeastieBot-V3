import { updateChattersAwesomeness } from "../../../utils";
import { BeastieLogger } from "../../../utils/Logging";
import CommandContext from "../utils/commandContext";
import { CommandModule } from "../index";

const execute = async (context: CommandContext): Promise<string> => {
  if (!context.para1) {
    return "No bonus given :(";
  }

  try {
    return updateChattersAwesomeness(parseInt(context.para1, 10));
  } catch (error) {
    BeastieLogger.warn(`updateChattersAwesomeness ERROR: ${error}`);
  }
};

const cmdModule = new CommandModule("bonusall", new Set([]), execute);
export default cmdModule;
