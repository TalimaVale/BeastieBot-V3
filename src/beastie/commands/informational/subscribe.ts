import { CommandModule } from "../index";
import CommandContext from "../utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  return context.platform === "twitch"
    ? `twitchRaid We are applying for Twitch partnership in July! Your viewership and subscriber support means so much, especially now. Subscribe today to join the Beastie Sub Team! => https://www.twitch.tv/subs/teamTALIMA twitchRaid`
    : `We are applying for Twitch partnership in July! Your viewership and subscriber support means so much, especially now. Subscribe today to join the Beastie Sub Team!\n=> https://www.twitch.tv/subs/teamTALIMA Thank you!`;
};

const cmdModule = new CommandModule(
  "subscribe",
  new Set([
    "twitchsub",
    "twitchsubscribe",
    "sub",
    "twitchprime",
    "subscribetotwitch",
    "subtotwitch"
  ]),
  execute
);
cmdModule.rateLimit = 1000 * 60;
export default cmdModule;
