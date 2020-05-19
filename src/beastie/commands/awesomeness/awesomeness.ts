import { getTwitchId } from "../../../utils";
import { BeastieLogger } from "../../../utils/Logging";
import { CommandModule } from "../index";
import CommandContext from "../utils/commandContext";
import { getAwesomeness } from "../../../services/db";

const execute = async (context: CommandContext): Promise<string> => {
  if (context.platform == "discord" && !context.para1) {
    return `Cannot understand... can you include a username?`;
  }

  let twitchId: string = context.twitchId;
  if (context.para1) {
    twitchId = await getTwitchId(context.para1);
    if (!twitchId) {
      return "Invalid twitch username supplied.";
    }
  }

  let awesomeness: number = await getAwesomeness(twitchId).catch(e => {
    BeastieLogger.warn(`readAwesomeness ERROR: ${e}`);
    return 0;
  });

  return `${context.displayName}, ${
    !context.para1 ? "you have" : context.para1 + " has"
  } ${awesomeness} awesomeness`;
};

const cmdModule = new CommandModule(
  "awesomeness",
  new Set(["points"]),
  execute
);
export default cmdModule;
