import tmi from "tmi.js";
import Twitter from "twitter";
import config from "../config";
import beastieOptions from "./beastieOptions";
import Webhooks from "../webhooks";
import twitterOptions from "../twitter/twitterOptions";
import { getBroadcasterId } from "../utils";
import { determineBeastieResponse } from "./events/message";
import handleFollow from "../webhooks/events/follow";
import handleStreamChange from "../webhooks/events/streamChange";
import handleSubscribe from "../webhooks/events/subscribe";
import { updateChattersAwesomeness, isStreaming } from "../utils";
import {
  awesomenessInterval,
  awesomenessIntervalAmount,
  discordInterval
} from "../utils/values";

interface StateType {
  isStreaming: boolean;
}

export default class BeastieBot {
  webhooks: Webhooks;
  tmiClient: tmi.Client;
  twitterClient: Twitter;
  // discord client with type
  broadcasterUsername: string;
  broadcasterId: number;

  state: StateType;

  awesomenessInterval: NodeJS.Timeout;
  awesomenessIntervalAmount: number;

  discordInterval: NodeJS.Timeout;

  initTmi() {
    const tmiClient = new tmi.Client(beastieOptions);

    tmiClient.on("message", (channel, tags, message, self) => {
      if (!self) this.onMessage(tags, message);
    });

    tmiClient.on("connected", () => {
      this.onConnect();
    });

    tmiClient.on("disconnected", () => {
      console.log("BEASTIE HAS BEEN DISCONNECTED");
      this.onDisconnect();
    });

    process.on("SIGINT", () => {
      console.log("SHUTTING DOWN ON SIGINT");
      this.onDisconnect();
    });

    return tmiClient;
  }

  constructor() {
    this.state = {
      isStreaming: false
    };

    this.awesomenessIntervalAmount = awesomenessIntervalAmount;

    this.tmiClient = this.initTmi();
    console.log("tmi init finished");
  }

  initWebhooks() {
    const webhooks = new Webhooks();
    webhooks.connect(this.broadcasterId);
    webhooks.on("stream", this.onStream.bind(this));
    webhooks.on("follow", this.onFollow.bind(this));
    //webhooks.on('subscribe', this.onSubscribe.bind(this))

    console.log("webhooks init finished");
    return webhooks;
  }

  initTwitter() {
    const twitterClient = new Twitter(twitterOptions);

    console.log("twitter init finished");
    return twitterClient;
  }

  initState = async () => {
    const isLive = await isStreaming();

    console.log("state init finished");
    return {
      ...this.state,
      isStreaming: isLive
    };
  };

  private async initBeastieBot() {
    this.broadcasterId = await getBroadcasterId(config.BROADCASTER_USERNAME);

    this.webhooks = this.initWebhooks();
    this.twitterClient = this.initTwitter();
    // init discord client

    this.state = await this.initState();
    console.log(this.state);

    console.log("init finished");
  }

  public async start() {
    await this.initBeastieBot();
    await this.tmiClient.connect();
    this.toggleStreamIntervals(this.state.isStreaming);
  }

  private say(msg) {
    this.tmiClient.say(config.BROADCASTER_USERNAME, msg);
  }

  private onMessage(tags, message) {
    const response = determineBeastieResponse(tags, message);
    if (response) this.say(response);
  }
  private onConnect() {
    this.say(`Hello team! I have awoken :D rawr`);
  }
  private onDisconnect() {
    this.say(`Goodbye team :) rawr`);
  }
  private onStream(payload) {
    const response = handleStreamChange(payload);
    // clear or start beastie streamIntervals based on the payload
    this.toggleStreamIntervals(this.state.isStreaming);
    // this.say(response) say something based on the payload
  }
  private onFollow(payload) {
    const response = handleFollow(payload);
    this.say(response);
  }
  private onSubscribe(payload) {
    const response = handleSubscribe(payload);
    this.say(response);
  }

  private toggleStreamIntervals(live) {
    if (live) {
      console.log("We are LIVE!");

      this.awesomenessInterval = setInterval(async () => {
        updateChattersAwesomeness(this.awesomenessIntervalAmount);
      }, awesomenessInterval);

      this.discordInterval = setInterval(async () => {
        console.log(
          "DISCORD LINK: posted server link with short pitch of community!"
        );
      }, discordInterval);
    } else {
      clearInterval(this.awesomenessInterval);
      clearInterval(this.discordInterval);
    }
  }
}
