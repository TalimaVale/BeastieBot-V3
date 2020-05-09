import { updateChattersAwesomeness } from "../../../utils";

export const command = "bonusall";

export const aliases = new Set([]);

export const execute = ({ para1 }) => {
  return updateChattersAwesomeness(para1).catch(error =>
    console.log("updateChattersAwesomeness ERROR", error)
  );
};
