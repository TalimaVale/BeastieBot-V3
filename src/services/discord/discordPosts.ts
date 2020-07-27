import { POST_EVENT } from "../../utils/values";
import { broadcaster } from "../twitch/TwitchAPI";

const discordPosts = async (event, memberUser = "") => {
  switch (event) {
    case POST_EVENT.DISCORD_MEMBER_ADD:
      return postGuildMemberAdd(memberUser);
    case POST_EVENT.DISCORD_LIVE:
      const broadcasterDisplayName = (await broadcaster.getProfile())
        ?.display_name;
      if (!broadcasterDisplayName) {
        throw "Failed to get broadcaster display name";
      }
      return postLive(broadcasterDisplayName);
    default:
      return;
  }
};

const postGuildMemberAdd = member => {
  return `Welcome to our Discord guild ${member}! RAWR`;
};

const postLive = broadcaster => {
  return `@here BeastieBot is rawring because we are LIVE! https://www.twitch.tv/${broadcaster} <:teamta1RAWR:704871701992702013>`;
};

/*const postFollows5 = () => {
  return;
};*/

export default discordPosts;
