import Twitter from "twitter";
import twitterOptions from "./twitterOptions";
import twitterPosts from "./twitterPosts";
import { BeastieLogger } from "../../utils/Logging";

export default class BeastieTwitterClient {
  client: Twitter | null;
  enabled: boolean;

  constructor() {
    const twitterClientEnabled = twitterOptions.access_token_key !== "";
    this.enabled = twitterClientEnabled;

    if (twitterClientEnabled) {
      this.client = new Twitter(twitterOptions);
    } else {
      this.client = null;
    }
  }

  public async destroy() {
    if (this.enabled) delete this.client;
  }

  private say = msg => {
    if (!this.client) {
      return;
    }
    this.client.post(
      "statuses/update",
      {
        status: msg
      },
      (error, tweet) => {
        if (error) {
          BeastieLogger.warn(
            `Failed to post to twitter: ${JSON.stringify(error)}`
          );
          throw error;
        }
        const { created_at, id, text, entities, user } = tweet;
        const { id: userId, screen_name } = user;
        BeastieLogger.debug(
          JSON.stringify(
            {
              created_at,
              id,
              text,
              entities,
              user: { userId, screen_name }
            },
            null,
            2
          )
        );
      }
    );
  };

  public post = async (event, streamId: string = "0") => {
    const msg = await twitterPosts(event, streamId);
    this.say(msg);
  };

  public postMessage = discordMsg => {
    const msg = `${discordMsg} #teamTALIMA #bot`;
    this.say(msg);
  };
}
