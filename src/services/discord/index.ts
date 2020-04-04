import Discord from "discord.js";
import { handleDiscordReady } from "./ready";
import discordPosts from "./discordPosts";
import { POST_EVENT, beastieDisconnectMessage } from "../../utils/values";

export default class BeastieDiscordClient {
  client: Discord.Client;

  discordGuildId: string;

  discordWelcomeChId: string;
  discordAnnouncementsChId: string;

  constructor() {
    this.client = new Discord.Client();

    // Event Listeners
    this.client.on("ready", () => {
      this.onReady();
    });

    this.client.on("guildMemberAdd", member => {
      this.onGuildMemberAdd(member);
    });

    this.client.on("disconnect", () => {
      console.log("BEASTIE HAS BEEN DISCONNECTED FROM DISCORD");
      this.onDisconnect();
    });

    process.on("SIGINT", () => {
      console.log("SHUTTING DOWN ON SIGINT");
      this.onDisconnect();
    });
  }

  // BeastieDiscordClient Actions
  private say = (channel, msg) => {
    if (Array.isArray(msg))
      msg.forEach(m => {
        //this.client.channels.get(channel).send(m, {});
      });
    //else this.client.channels.get(channel).send(msg, {});
  };

  private discordChannels = event => {
    switch (event) {
      case POST_EVENT.LIVE:
        return this.discordAnnouncementsChId;
      default:
        return this.discordAnnouncementsChId;
    }
  };

  public post = event => {
    const msg = discordPosts(event);
    const channel = this.discordChannels(event);
    this.say(channel, msg);
  };

  // Event Handlers
  private onDisconnect() {
    this.say(this.discordAnnouncementsChId, beastieDisconnectMessage);
  }

  private onReady() {
    const response = handleDiscordReady(this.client);

    this.discordGuildId = response.discordGuildId;
    this.discordWelcomeChId = response.discordWelcomeChId;
    this.discordAnnouncementsChId = response.discordAnnouncementsChId;
  }

  private onGuildMemberAdd = async member => {
    const msg = await discordPosts(POST_EVENT.DISCORD_MEMBER_ADD, member.user);
    this.say(this.discordWelcomeChId, msg);
  };
}
