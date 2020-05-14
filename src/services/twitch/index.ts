import tmi from "tmi.js";
import twitchOptions from "./twitchOptions";
import config from "../../config";
import CommandContext from "../../beastie/commands/utils/commandContext";
import determineCommand from "../../beastie/commands";
import { checkForRaidMessage } from "../../beastie/raid";
import { startRaiding } from "../../beastie/raid";
import { endRaid } from "../../beastie/raid";
import {
  beastieConnectMessage,
  beastieDisconnectMessage,
  awesomenessInterval,
  awesomenessIntervalAmount,
  discordInterval,
  discordIntervalMessage,
  raidTimer,
  raidMessage,
  POST_EVENT
} from "../../utils/values";
import { updateChattersAwesomeness } from "../../utils";
import twitchPosts from "./twitchPosts";

export default class BeastieTwitchService {
  client: tmi.Client;

  broadcasterUsername: string;

  // raid feature
  activeRaid: boolean;
  raidMessage: string;
  raidTeam: Array<number>;
  hostedChannel: string;
  raidReward: number;

  // interval messages feature
  awesomenessInterval: NodeJS.Timeout;
  awesomenessIntervalAmount: number;
  discordInterval: NodeJS.Timeout;

  constructor() {
    this.client = new tmi.Client(twitchOptions);
    this.broadcasterUsername = config.BROADCASTER_USERNAME;
    this.awesomenessIntervalAmount = awesomenessIntervalAmount;
    this.activeRaid = false;
    this.raidMessage = raidMessage;
    this.raidTeam = [];
    this.hostedChannel = "";
    this.raidReward = 0;

    // Event Listeners
    this.client.on("message", (channel, tags, message, self) => {
      if (!self) this.onMessage(channel, tags, message);
    });

    this.client.on("hosting", (channel, target, viewers) => {
      this.onHosting(target, viewers);
    });

    this.client.on("connected", () => {
      this.onConnect();
    });

    this.client.on("disconnected", () => {
      console.log("BEASTIE HAS BEEN DISCONNECTED FROM TWITCH");
      this.onDisconnect();
    });

    process.on("SIGINT", () => {
      console.log("SHUTTING DOWN ON SIGINT");
      this.onDisconnect();
      setTimeout(() => process.exit(), 500);
    });
  }

  // BeastieTwitchClient Actions
  private say = msg => {
    if (Array.isArray(msg))
      msg.forEach(m => {
        this.client.say(this.broadcasterUsername, m);
      });
    else this.client.say(this.broadcasterUsername, msg);
  };

  public post = (event, name) => {
    const msg = twitchPosts(event, name);
    this.say(msg);
  };

  public toggleStreamIntervals = live => {
    if (live) {
      console.log("Stream intervals running...");
      if (this.awesomenessInterval === undefined)
        this.awesomenessInterval = setInterval(async () => {
          updateChattersAwesomeness(this.awesomenessIntervalAmount).catch(
            error => console.log("updateChattersAwesomeness ERROR", error)
          );
        }, awesomenessInterval);
      if (this.discordInterval === undefined)
        this.discordInterval = setInterval(async () => {
          this.client.say(discordIntervalMessage);
        }, discordInterval);
    } else {
      clearInterval(this.awesomenessInterval);
      clearInterval(this.discordInterval);
    }
  };

  // Event Handlers
  private onConnect = () => {
    this.say(beastieConnectMessage);
  };

  private onDisconnect = () => {
    this.say(beastieDisconnectMessage);
  };

  private onMessage = async (channel, tags, message) => {
    if (message.startsWith("!")) {
      const [command = "!", para1 = "", para2 = ""] = message.split(" ");
      const badges = tags.badges ? Object.keys(tags.badges) : [];
      if (badges.includes("broadcaster")) badges.push("moderator");

      const commandModule = determineCommand(command.slice(1), badges);
      if (commandModule) {
        const platform = "twitch";
        const client = this;
        const username = tags.username;
        const displayName = tags["display-name"];

        const response = await commandModule.execute(
          new CommandContext({
            platform,
            client,
            message,
            command,
            para1,
            para2,
            username,
            displayName
          })
        );

        if (response) this.say(response);
      }
    }

    if (this.activeRaid && this.hostedChannel !== "")
      checkForRaidMessage(this, channel, tags, message);
  };

  private onHosting = async (target, viewers) => {
    if (this.activeRaid) {
      const startResponse = startRaiding(this, target, viewers);
      this.say(startResponse);

      // TODO: UnhandledPromiseRejectionWarning
      const endResponse: any = await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(endRaid(this.client, target, this.raidReward));
          } catch (e) {
            reject(e);
          }
        }, raidTimer);
      });
      this.activeRaid = endResponse.activeRaid;
      this.raidTeam = endResponse.raidTeam;
      this.raidReward = endResponse.raidReward;
      this.say(endResponse.messages);
    } else this.post(POST_EVENT.TWITCH_HOSTING, target);
  };
}
