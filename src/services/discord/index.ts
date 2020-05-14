import Discord from "discord.js";
import CommandContext from "../../beastie/commands/utils/commandContext";
import determineCommand from "../../beastie/commands";
import { handleDiscordReady } from "./ready";
import discordPosts from "./discordPosts";
import { POST_EVENT, beastieDisconnectMessage } from "../../utils/values";

export default class BeastieDiscordClient {
  client: Discord.Client;

  discordGuildId: string;

  discordWelcomeChId: string;
  discordTalimasFeedChId: string;

  constructor() {
    this.client = new Discord.Client();

    // Event Listeners
    this.client.on("ready", () => {
      this.onReady();
    });

    this.client.on("message", message => {
      this.onMessage(message);
    });

    this.client.on("guildMemberAdd", member => {
      this.onGuildMemberAdd(member);
    });

    this.client.on("disconnect", () => {
      console.log("BEASTIE HAS BEEN DISCONNECTED FROM DISCORD");
      //this.onDisconnect();
    });

    process.on("SIGINT", () => {
      console.log("SHUTTING DOWN ON SIGINT");
      //this.onDisconnect();
    });
  }

  // BeastieDiscordClient Actions
  private say = (channel, msg) => {
    if (Array.isArray(msg))
      msg.forEach(m => {
        (this.client.channels.get(channel) as Discord.TextChannel).send(m, {});
      });
    else
      (this.client.channels.get(channel) as Discord.TextChannel).send(msg, {});
  };

  private discordChannels = event => {
    switch (event) {
      case POST_EVENT.LIVE:
        return this.discordTalimasFeedChId;
      default:
        return this.discordTalimasFeedChId;
    }
  };

  public post = event => {
    const msg = discordPosts(event);
    const channel = this.discordChannels(event);
    this.say(channel, msg);
  };

  // Event Handlers
  private onDisconnect() {
    this.say(this.discordTalimasFeedChId, beastieDisconnectMessage);
  }

  private onReady() {
    const response = handleDiscordReady(this.client);

    this.discordGuildId = response.discordGuildId;
    this.discordWelcomeChId = response.discordWelcomeChId;
    this.discordTalimasFeedChId = response.discordTalimasFeedChId;
    this.say(this.discordWelcomeChId, "rawr");
  }

  private onMessage = async ({ content: message, author, member, channel }) => {
    if (message.startsWith("!")) {
      const [command = "!", para1 = "", para2 = ""] = message.split(" ");
      const roles = member.roles.map(role => role.name);

      const commandModule = determineCommand(command.slice(1), roles);
      if (commandModule) {
        const platform = "discord";
        const client = this.client;
        const username = author.tag;
        const displayName = author.toString();

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

        if (response) this.say(channel.id, response);
      }
    }
  };

  private onGuildMemberAdd = async member => {
    const msg = await discordPosts(POST_EVENT.DISCORD_MEMBER_ADD, member.user);
    this.say(this.discordWelcomeChId, msg);
  };
}
