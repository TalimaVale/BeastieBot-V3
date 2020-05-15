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
import { BeastieLogger } from "../../utils/Logging";

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
    // @ts-ignore
    this.client = new tmi.Client(twitchOptions);
    this.broadcasterUsername = config.BROADCASTER_USERNAME;
    this.awesomenessIntervalAmount = awesomenessIntervalAmount;
    this.activeRaid = false;
    this.raidMessage = raidMessage;
    this.raidTeam = [];
    this.hostedChannel = "";
    this.raidReward = 0;

    // Event Listeners
    this.client.on("message", async (channel, tags, message, self) => {
      if (!self) await this.onMessage(channel, tags, message);
    });

    this.client.on("hosting", async (channel, target, viewers) => {
      try {
        await this.onHosting(target, viewers);
      } catch (e) {
        BeastieLogger.warn(`Failed handling hosting: ${e}`);
      }
    });

    this.client.on("connected", async () => {
      BeastieLogger.info(`Beastie has connected to twitch`);
      await this.onConnect();
    });

    this.client.on("disconnected", async () => {
      BeastieLogger.info("BEASTIE HAS BEEN DISCONNECTED FROM TWITCH");
      await this.onDisconnect();
    });

    process.on("SIGINT", async () => {
      BeastieLogger.info("SHUTTING DOWN ON SIGINT");
      await this.onDisconnect();
    });
  }

  // BeastieTwitchClient Actions
  private say = async msg => {
    if (Array.isArray(msg)) {
      for (const m of msg) {
        await this.say(m);
      }
    } else {
      try {
        await this.client.say(this.broadcasterUsername, msg);
      } catch (e) {
        BeastieLogger.warn(`Failed to send message: ${e}`);
      }
    }
  };

  public post = (event, name) => {
    const msg = twitchPosts(event, name);
    return this.say(msg);
  };

  public toggleStreamIntervals = live => {
    if (live) {
      BeastieLogger.info("Stream intervals running...");
      if (this.awesomenessInterval === undefined)
        this.awesomenessInterval = setInterval(() => {
          updateChattersAwesomeness(this.awesomenessIntervalAmount).catch(
            error =>
              BeastieLogger.error(`updateChattersAwesomeness ERROR ${error}`)
          );
        }, awesomenessInterval);
      if (this.discordInterval === undefined)
        this.discordInterval = setInterval(async () => {
          await this.say(discordIntervalMessage);
        }, discordInterval);
    } else {
      clearInterval(this.awesomenessInterval);
      clearInterval(this.discordInterval);
    }
  };

  // Event Handlers
  private onConnect = async () => {
    await this.say(beastieConnectMessage);
  };

  private onDisconnect = async () => {
    await this.say(beastieDisconnectMessage);
  };

  private onMessage = async (channel, tags, message) => {
    if (!message.startsWith("!")) {
      if (this.activeRaid && this.hostedChannel !== "") {
        checkForRaidMessage(this, channel, tags, message);
      }
      return;
    }
    const [command = "!", para1 = "", para2 = ""] = message.split(" ");
    const badges = tags.badges ? Object.keys(tags.badges) : [];
    if (badges.includes("broadcaster")) badges.push("moderator");

    const commandModule = determineCommand(command.slice(1), badges);
    if (commandModule) {
      const platform = "twitch";
      const client = this;
      const username = tags.username;
      const displayName = tags["display-name"];

      try {
        const response = await commandModule.execute(
          new CommandContext({
            platform,
            client,
            message,
            command,
            para1,
            para2,
            username,
            displayName,
            roles: badges
          })
        );

        if (response) await this.say(response);
      } catch (reason) {
        BeastieLogger.warn(`Failed to execute command because: ${reason}`);
      }
    }
  };

  private onHosting = async (target, viewers) => {
    if (!this.activeRaid) {
      await this.post(POST_EVENT.TWITCH_HOSTING, target);
      return;
    }

    const startResponse = startRaiding(this, target, viewers);
    await this.say(startResponse);

    setTimeout(async () => {
      try {
        const endResponse = endRaid(this.client, target, this.raidReward);
        this.activeRaid = endResponse.activeRaid;
        this.raidTeam = endResponse.raidTeam;
        this.raidReward = endResponse.raidReward;
        await this.say(endResponse.messages);
      } catch (e) {
        BeastieLogger.warn(`Failed to end raid: ${e}`);
      }
    }, raidTimer);
  };
}
