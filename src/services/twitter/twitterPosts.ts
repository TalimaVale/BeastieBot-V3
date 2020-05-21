import { POST_EVENT } from "../../utils/values";
import { broadcaster } from "../twitch/TwitchAPI";

const twitterPosts = async (event, streamId: string) => {
  switch (event) {
    case POST_EVENT.LIVE:
      const broadcasterDisplayName = (await broadcaster.getProfile())
        ?.display_name;
      if (!broadcasterDisplayName) {
        throw "Failed to get streamer display_name";
      }
      return postLive(broadcasterDisplayName, streamId);
    default:
      return;
  }
};

const postLive = (broadcaster: string, streamId: string) => {
  return `BeastieBot is rawring because we are LIVE! RAWR https://www.twitch.tv/${broadcaster}#stream-${streamId} #${broadcaster} #GameDev #WebDev`;
};

/*const postFollows5 = () => {
  return;
};*/

export default twitterPosts;
