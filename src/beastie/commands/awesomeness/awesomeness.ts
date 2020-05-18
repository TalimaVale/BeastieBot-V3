import { readAwesomeness } from "../../../utils";
import { BeastieLogger } from "../../../utils/Logging";

export const command = "awesomeness";

export const aliases = new Set(["points"]);

export const execute = async ({ platform, username, displayName, para1 }) => {
  const user = platform === "twitch" ? username : para1;

  if (user !== "") {
    const msg = await readAwesomeness(user, displayName).catch(error =>
      BeastieLogger.warn(`readAwesomeness ERROR: ${error}`)
    );
    return platform === "twitch" ? `@${msg}` : msg;
  }
  return `Cannot understand... can you include a username?`;
};
