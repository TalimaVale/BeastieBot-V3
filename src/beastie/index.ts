import config from "../config";
import TwitchWebhooksServer from "../services/twitchWebhooks";
import BeastieTwitterClient from "../services/twitter";
import { getBroadcasterId, initStream } from "../utils";
import handleStreamChange from "../services/twitchWebhooks/streamChange";
import BeastieTwitchClient from "../services/twitch";
import { POST_EVENT } from "../utils/values";
import BeastieDiscordClient from "../services/discord";

interface StateType {
  isStreaming: boolean;
  curStreamId: number;
}

export default class BeastieBot {
  state: StateType;

  twitchClient: BeastieTwitchClient;
  twitchWebhooks: TwitchWebhooksServer;
  discordClient: BeastieDiscordClient;
  twitterClient: BeastieTwitterClient;

  broadcasterId: number;

  private constructor() {}

  public static async create() {
    const beastie = new BeastieBot();

    beastie.state = {
      isStreaming: false,
      curStreamId: 0
    };

    beastie.twitchClient = beastie.initTwitch();
    beastie.broadcasterId = await getBroadcasterId();
    beastie.twitchWebhooks = beastie.initTwitchWebhooks();
    beastie.discordClient = beastie.initDiscord();
    beastie.twitterClient = beastie.initTwitter();

    beastie.state = await beastie.initState();

    console.log("init finished");
    return beastie;
  }

  initTwitch() {
    const twitchClient = new BeastieTwitchClient();

    // Twitch Event Listeners that affect other services

    console.log("twitch init finished");
    return twitchClient;
  }

  initTwitchWebhooks() {
    const twitchWebhooks = new TwitchWebhooksServer();
    console.log(this.broadcasterId);
    twitchWebhooks.connect(this.broadcasterId);

    // Twitch Webhooks Event Listeners that affect other services
    twitchWebhooks.server.on("streams", payload => {
      this.onStreamChange(payload);
    });

    twitchWebhooks.server.on("users/follows", payload => {
      this.onFollow(payload);
    });

    twitchWebhooks.server.on("subscriptions/events", payload => {
      this.onSubscribe(payload);
    });

    console.log("webhooks init finished");
    return twitchWebhooks;
  }

  initTwitter() {
    const twitterClient = new BeastieTwitterClient();

    // Twitter Event Listeners that affect other services

    console.log("twitter init finished");
    return twitterClient;
  }

  initDiscord() {
    const discordClient = new BeastieDiscordClient();

    discordClient.client.on("message", message => {
      this.onDiscordMessage(message);
    });

    console.log(`discord init finished`);
    return discordClient;
  }

  initState = async () => {
    const stream = await initStream();

    console.log("state init finished");
    return {
      ...this.state,
      isStreaming: stream.live,
      curStream: stream.id
    };
  };

  public async start() {
    await this.twitchClient.client.connect();
    await this.discordClient.client.login(config.DISCORD_TOKEN);
    this.twitchClient.toggleStreamIntervals(this.state.isStreaming);
  }

  private onStreamChange(payload) {
    const stream = payload.data[0];
    const response = handleStreamChange(stream, this.state.curStreamId);

    this.state.isStreaming = response.live;
    this.state.curStreamId = response.streamId;

    if (response.newStream) {
      this.twitterClient.post(POST_EVENT.LIVE, this.state.curStreamId);
      this.discordClient.post(POST_EVENT.LIVE);
    } else if (!this.state.isStreaming) {
      // post to twitch 'Goodbye, thanks for watching'
    }
    // handle title change
    // handle game_id change

    this.twitchClient.toggleStreamIntervals(this.state.isStreaming);
  }

  private onFollow(payload) {
    const { from_name } = payload.event.data[0];
    this.twitchClient.post(POST_EVENT.TWITCH_NEW_FOLLOW, from_name);
    // twitter and discord post for follow milestones per stream
  }

  private onSubscribe(payload) {
    const { user_name } = payload.event.data[0].event_data;
    this.twitchClient.post(POST_EVENT.TWITCH_NEW_SUB, user_name);
    // twitter and discord post for subscriber milestones per stream
  }

  private onDiscordMessage = message => {
    if (message.channel.id === this.discordClient.discordTalimasFeedChId)
      this.twitterClient.postMessage(message);
  };
}
