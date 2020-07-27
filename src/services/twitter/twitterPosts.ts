import { POST_EVENT } from "../../utils/values";
import { broadcaster } from "../twitch/TwitchAPI";

const twitterPosts = async (event, streamId: string) => {
  switch (event) {
    case POST_EVENT.TWITTER_LIVE:
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
  return `We are LIVE! twitch.tv/${broadcaster}#stream-${streamId} RAWR #GameDev #UnrealEngine #ProceduralGeneration #bot`;
};

/*const postFollows5 = () => {
  return;
};*/

export default twitterPosts;
