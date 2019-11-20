import { determineBonus } from "./bonus";
import { greetings, sayBeastieGreeting } from "./greetings";
import { startRaidTeam, joinRaidTeam } from "../../../beastie/raid";
// import redeemReward, { aliases as redeemAliases } from '../commands/redeem'

export const COMMANDS = {
  GREETING: "greeting",
  BONUS: "bonus ",
  BONUS_ALL: "bonusall ",
  START_RAID: "startraid",
  JOIN_RAID: "joinraid",
  POST_TO_TWITTER: "twitterpost",
  REDEEM_REWARD: "redeem"
};

export const BADGES = {
  TEAMMATE: "teammate",
  STAFF: "staff",
  SUBSCRIBER: "subscriber",
  MODERATOR: "moderator",
  BROADCASTER: "broadcaster"
};

const determineCommandAction = (beastie, badge, commandType, command, tags) => {
  switch (true) {
    // TEAMMATE commands
    case commandType === COMMANDS.GREETING:
      return sayBeastieGreeting(tags, badge, command);
    case commandType === COMMANDS.JOIN_RAID:
      return joinRaidTeam(beastie, tags);
    case commandType === COMMANDS.REDEEM_REWARD:
      return; //redeemReward({ tags, message })
    // SUBSCRIBER commands
    // MODERATOR commands
    case commandType === COMMANDS.START_RAID &&
      (badge === BADGES.MODERATOR || badge === BADGES.BROADCASTER):
      return startRaidTeam(beastie);
    // BROADCASTER commands
    case commandType === COMMANDS.BONUS && badge === BADGES.BROADCASTER:
      determineBonus(command);
      return;
    case commandType === COMMANDS.BONUS_ALL && badge === BADGES.BROADCASTER:
      determineBonus(command);
      return;
    case commandType === COMMANDS.POST_TO_TWITTER &&
      badge === BADGES.BROADCASTER:
      console.log(`post 'command message' to twitter`);
      return;
    default:
      return;
  }
};

const getCommand = message => {
  return message.toLowerCase().slice(1);
};

const determineCommandType = (command: string) => {
  if (greetings.has(command)) return COMMANDS.GREETING;
  if (command.substring(0, 6) === COMMANDS.BONUS) return COMMANDS.BONUS;
  if (command.substring(0, 9) === COMMANDS.BONUS_ALL) return COMMANDS.BONUS_ALL;
  if (command === COMMANDS.START_RAID) return COMMANDS.START_RAID;
  if (command === COMMANDS.JOIN_RAID) return COMMANDS.JOIN_RAID;
  if (command === COMMANDS.POST_TO_TWITTER) return COMMANDS.POST_TO_TWITTER;
  // if (
  //   message.startsWith(COMMANDS.REDEEM_REWARD + ' ') ||
  //   message === COMMANDS.REDEEM_REWARD ||
  //   redeemAliases.some(
  //     redeemAlias =>
  //       message.startsWith(redeemAlias + ' ') || message === redeemAlias
  //   )
  // )
  //   return COMMANDS.REDEEM_REWARD
};

const getBadge = tags => {
  if (tags.badges) {
    if (tags.badges.hasOwnProperty("broadcaster")) return BADGES.BROADCASTER;
    if (tags.badges.hasOwnProperty("staff")) return BADGES.STAFF;
    if (tags.badges.hasOwnProperty("moderator")) return BADGES.MODERATOR;
    if (tags.badges.hasOwnProperty("subscriber")) return BADGES.SUBSCRIBER;
  } else return BADGES.TEAMMATE;
};

export const determineBeastieResponse = async (beastie, tags, message) => {
  if (message[0] !== "!") return;
  const command = getCommand(message);
  const commandType = determineCommandType(command);
  const badge = getBadge(tags);
  console.log(badge);
  return determineCommandAction(beastie, badge, commandType, command, tags);
};
