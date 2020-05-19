import config from "../config";
import TwitchWebhooksServer from "../services/twitchWebhooks";
import BeastieTwitterClient from "../services/twitter";
import { getBroadcasterId, initStream } from "../utils";
import handleStreamChange from "../services/twitchWebhooks/streamChange";
import BeastieTwitchClient from "../services/twitch";
import { POST_EVENT } from "../utils/values";
import BeastieDiscordClient from "../services/discord";
import { BeastieLogger } from "../utils/Logging";
import { checkTeammateTable } from "../services/db";

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

  broadcasterId: string;

  private constructor() {}

  public static async create() {
    if (!(await checkTeammateTable())) {
      throw `Issue checking on database, see log`;
    }

    const beastie = new BeastieBot();

    beastie.state = {
      isStreaming: false,
      curStreamId: 0
    };

    beastie.twitchClient = beastie.initTwitch();
    beastie.broadcasterId = await getBroadcasterId();
    //beastie.twitchWebhooks = beastie.initTwitchWebhooks();
    beastie.discordClient = beastie.initDiscord();
    beastie.twitterClient = beastie.initTwitter();

    beastie.state = await beastie.initState();

    BeastieLogger.info("init finished");
    return beastie;
  }

  async destroy() {
    let results = await Promise.allSettled([
      this.twitchClient.destroy(),
      this.discordClient.destroy(),
      this.twitterClient.destroy()
    ]);
    let rejResult = results.find(
      rsp => rsp.status === "rejected"
    ) as PromiseRejectedResult;
    if (rejResult) {
      throw rejResult.reason;
    }

    delete this.twitchClient;
    delete this.discordClient;
    delete this.twitterClient;
  }

  initTwitch() {
    const twitchClient = new BeastieTwitchClient();

    // Twitch Event Listeners that affect other services

    BeastieLogger.info("twitch init finished");
    return twitchClient;
  }

  initTwitchWebhooks() {
    const twitchWebhooks = new TwitchWebhooksServer();
    BeastieLogger.debug(`Webhooks broadcasterId ${this.broadcasterId}`);
    twitchWebhooks.connect(this.broadcasterId);

    // Twitch Webhooks Event Listeners that affect other services
    twitchWebhooks.server.on("streams", async payload => {
      await this.onStreamChange(payload);
    });

    twitchWebhooks.server.on("users/follows", async payload => {
      await this.onFollow(payload);
    });

    twitchWebhooks.server.on("subscriptions/events", async payload => {
      await this.onSubscribe(payload);
    });

    BeastieLogger.info("webhooks init finished");
    return twitchWebhooks;
  }

  initTwitter() {
    const twitterClient = new BeastieTwitterClient();

    // Twitter Event Listeners that affect other services

    BeastieLogger.info("twitter init finished");
    return twitterClient;
  }

  initDiscord() {
    const discordClient = new BeastieDiscordClient();

    discordClient.client.on("message", message => {
      this.onDiscordMessage(message);
    });

    BeastieLogger.info("discord init finished");
    return discordClient;
  }

  initState = async (): Promise<StateType> => {
    const stream = await initStream();

    BeastieLogger.info("state init finished");
    return {
      ...this.state,
      isStreaming: stream.live,
      curStreamId: stream.id
    };
  };

  public async start() {
    await this.twitchClient.client.connect();
    await this.discordClient.client.login(config.DISCORD_TOKEN);
    this.twitchClient.toggleStreamIntervals(this.state.isStreaming);
  }

  private async onStreamChange(payload) {
    const stream = payload.data[0];
    const response = handleStreamChange(stream, this.state.curStreamId);

    this.state.isStreaming = response.live;
    this.state.curStreamId = response.streamId;

    if (response.newStream) {
      this.twitterClient
        .post(POST_EVENT.LIVE, this.state.curStreamId)
        .catch(reason => {
          BeastieLogger.warn(
            `Failed to complete twitter POST_EVENT.LIVE: ${reason}`
          );
        });
      this.discordClient.post(POST_EVENT.LIVE).catch(reason => {
        BeastieLogger.warn(
          `Failed to complete discord POST_EVENT.LIVE: ${reason}`
        );
      });
    } else if (!this.state.isStreaming) {
      try {
        await this.twitchClient.post(POST_EVENT.END_OF_STREAM, null);
      } catch (e) {
        BeastieLogger.warn(`Failed to post subscription message: ${e}`);
      }
    }
    // handle title change
    // handle game_id change

    this.twitchClient.toggleStreamIntervals(this.state.isStreaming);
  }

  private async onFollow(payload) {
    try {
      const { from_name } = payload.event.data[0];
      await this.twitchClient.post(POST_EVENT.TWITCH_NEW_FOLLOW, from_name);
    } catch (e) {
      BeastieLogger.warn(`Failed to post subscription message: ${e}`);
    }
    // twitter and discord post for follow milestones per stream
  }

  private async onSubscribe(payload) {
    try {
      const { user_name } = payload.event.data[0].event_data;
      await this.twitchClient.post(POST_EVENT.TWITCH_NEW_SUB, user_name);
    } catch (e) {
      BeastieLogger.warn(`Failed to post subscription message: ${e}`);
    }
    // twitter and discord post for subscriber milestones per stream
  }

  private onDiscordMessage = message => {
    if (message.channel.id === this.discordClient.discordTalimasFeedChId)
      if (this.twitterClient) {
        this.twitterClient.postMessage(message);
      }
  };
}
