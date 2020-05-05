import { greetings, sayBeastieGreeting } from "./greetings";
import { startRaidTeam, joinRaidTeam } from "../../../beastie/raid";

const COMMANDS = {
  GREETING: "greeting",
  START_RAID: "startraid",
  JOIN_RAID: "joinraid",
  POST_TO_TWITTER: "twitterpost"
};

const determineMessageType = (rawMessage: string) => {
  const message = rawMessage.toLowerCase().slice(1);
  if (greetings.has(message)) return COMMANDS.GREETING;
  if (message === COMMANDS.START_RAID) return COMMANDS.START_RAID;
  if (message === COMMANDS.JOIN_RAID) return COMMANDS.JOIN_RAID;
  if (message === COMMANDS.POST_TO_TWITTER) return COMMANDS.POST_TO_TWITTER;
};

export const determineBeastieResponse = (beastie, tags, message) => {
  const messageType = determineMessageType(message);

  switch (messageType) {
    case COMMANDS.GREETING:
      return sayBeastieGreeting(tags, message);
    case COMMANDS.START_RAID:
      return startRaidTeam(beastie);
    case COMMANDS.JOIN_RAID:
      return joinRaidTeam(beastie, tags);
    case COMMANDS.POST_TO_TWITTER:
      console.log(`post 'command message' to twitter`);
      return;
    default:
      return;
  }
};
