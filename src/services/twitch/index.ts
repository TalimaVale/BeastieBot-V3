import tmi from "tmi.js";
import twitchOptions from "./twitchOptions";
import config from "../../config";
import CommandContext from "../../beastie/commands/utils/commandContext";
import { CommandModule, determineCommand } from "../../beastie/commands";
import { checkForRaidMessage, endRaid, startRaiding } from "../../beastie/raid";
import {
  awesomenessInterval,
  awesomenessIntervalAmount,
  beastieConnectMessage,
  beastieDisconnectMessage,
  discordInterval,
  discordIntervalMessage,
  POST_EVENT,
  raidMessage,
  raidTimer
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

  messageQueue: string[];
  messageQueueRate: number = 1000 * 5;
  messageQueueInterval: NodeJS.Timeout = null;

  constructor() {
    // @ts-ignore
    this.client = new tmi.Client(twitchOptions);
    this.broadcasterUsername = config.BROADCASTER_USERNAME.toLocaleLowerCase();
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
      this.messageQueueInterval = setInterval(
        this.sayQueue,
        this.messageQueueRate
      );
    });

    this.client.on("disconnected", async () => {
      BeastieLogger.info("BEASTIE HAS BEEN DISCONNECTED FROM TWITCH");
      await this.onDisconnect();
    });
  }

  public async destroy() {
    BeastieLogger.info("SHUTTING DOWN ON SIGINT");
    await this.onSIGINT();
  }

  private sayQueue = async () => {
    let msg = this.messageQueue.pop();
    if (msg) {
      try {
        await this.client.say(this.broadcasterUsername, msg);
      } catch (e) {
        BeastieLogger.warn(`Failed to send message: ${e}`);
      }
    }
  };

  // BeastieTwitchClient Actions
  private say = async (msg: string | string[]) => {
    if (!Array.isArray(msg)) {
      this.messageQueue.push(msg);
      return;
    }

    msg.forEach(m => {
      this.messageQueue.push(m);
    });
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
          updateChattersAwesomeness(
            this.awesomenessIntervalAmount
          ).catch(error =>
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
    clearInterval(this.messageQueueInterval);
    this.messageQueueInterval = null;
  };

  private onSIGINT = async () => {
    await this.say(beastieDisconnectMessage);
    clearInterval(this.messageQueueInterval);
    this.messageQueueInterval = null;
    await this.client.disconnect();
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

    const commandModule: CommandModule = determineCommand(
      command.slice(1),
      badges
    );
    if (commandModule) {
      try {
        const response: string | void = await commandModule.execute(
          new CommandContext({
            platform: "twitch",
            client: this,
            message,
            command,
            para1,
            para2,
            username: tags.username,
            displayName: tags["display-name"],
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
