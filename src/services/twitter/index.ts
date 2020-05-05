import Twitter from "twitter";
import twitterOptions from "./twitterOptions";
import twitterPosts from "./twitterPosts";

export default class BeastieTwitterClient {
  client: Twitter;

  constructor() {
    this.client = new Twitter(twitterOptions);
  }

  private say = msg => {
    this.client.post(
      "statuses/update",
      {
        status: msg
      },
      (error, tweet, response) => {
        if (error) throw error;
        const { created_at, id, text, entities, user } = tweet;
        const { id: userId, screen_name } = user;
        console.log(
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

  public post = async (event, streamId = 0) => {
    const msg = await twitterPosts(event, streamId);
    this.say(msg);
  };

  public postMessage = async discordMsg => {
    const msg = `${discordMsg} #teamTALIMA #bot`;
    this.say(msg);
  };
}
