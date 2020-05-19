import { readAwesomeness } from "../../../utils";
import { BeastieLogger } from "../../../utils/Logging";
import { CommandModule } from "../index";
import CommandContext from "../utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  const user = context.platform === "twitch" ? context.username : context.para1;

  if (user === "") {
    return `Cannot understand... can you include a username?`;
  }

  let msg: string;
  try {
    msg = await readAwesomeness(user, context.displayName);
  } catch (e) {
    BeastieLogger.warn(`readAwesomeness ERROR: ${e}`);
    msg = "Could not fetch awesomeness!";
  }
  return context.platform === "twitch" ? `@${msg}` : msg;
};

const cmdModule = new CommandModule(
  "awesomeness",
  new Set(["points"]),
  execute
);
export default cmdModule;
