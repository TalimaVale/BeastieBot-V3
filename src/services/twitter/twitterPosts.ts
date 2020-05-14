import { getBroadcasterDisplayName } from "../../utils";
import { POST_EVENT } from "../../utils/values";

const twitterPosts = async (event, streamId) => {
  switch (event) {
    case POST_EVENT.LIVE:
      const broadcasterDisplayName = await getBroadcasterDisplayName();
      return postLive(broadcasterDisplayName, streamId);
    default:
      return;
  }
};

const postLive = (broadcaster, streamId) => {
  return `BeastieBot is rawring because we are LIVE! RAWR https://www.twitch.tv/${broadcaster}#stream-${streamId} #${broadcaster} #GameDev #WebDev`;
};

/*const postFollows5 = () => {
  return;
};*/

export default twitterPosts;
