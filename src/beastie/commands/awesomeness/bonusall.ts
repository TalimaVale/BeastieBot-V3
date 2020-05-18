import { updateChattersAwesomeness } from "../../../utils";
import { BeastieLogger } from "../../../utils/Logging";

export const command = "bonusall";

export const aliases = new Set([]);

export const execute = ({ para1 }) => {
  return updateChattersAwesomeness(para1).catch(error =>
    BeastieLogger.warn(`updateChattersAwesomeness ERROR: ${error}`)
  );
};
