import { updateTeammateAwesomeness } from "../../../utils";
import { BeastieLogger } from "../../../utils/Logging";
import CommandContext from "../utils/commandContext";
import { CommandModule } from "../index";

const execute = async (context: CommandContext): Promise<string> => {
  try {
    return await updateTeammateAwesomeness(context.para1, context.para2);
  } catch (error) {
    BeastieLogger.warn(`"updateTeammateAwesomeness ERROR ${error}`);
  }
  return "";
};

const cmdModule = new CommandModule("bonus", new Set([]), execute);
export default cmdModule;
