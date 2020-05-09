import { updateTeammateAwesomeness } from "../../../utils";

export const command = "bonus";

export const aliases = new Set([]);

export const execute = async ({ para1: username, para2: amount }) => {
  return await updateTeammateAwesomeness(username, amount).catch(error =>
    console.log("updateTeammateAwesomeness ERROR", error)
  );
};
