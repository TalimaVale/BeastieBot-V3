import { POST_EVENT } from "../../utils/values";
import { getDisplayName } from "../../utils";
import config from "../../config";

const discordPosts = async (event, memberUser = "") => {
  switch (event) {
    case POST_EVENT.DISCORD_MEMBER_ADD:
      return postGuildMemberAdd(memberUser);
    case POST_EVENT.LIVE:
      const broadcasterDisplayName = await getDisplayName(
        config.BROADCASTER_USERNAME
      );
      return postLive(broadcasterDisplayName);
    default:
      return;
  }
};

const postGuildMemberAdd = member => {
  return `Welcome to our Discord guild ${member}! RAWR`;
};

const postLive = broadcaster => {
  return `BeastieBot is rawring because we are LIVE! RAWR https://www.twitch.tv/${broadcaster}`;
};

const postFollows5 = () => {
  return;
};

export default discordPosts;
