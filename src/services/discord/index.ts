import Discord, { TextChannel, Message, GuildMember } from "discord.js";
import CommandContext from "../../beastie/commands/utils/commandContext";
import determineCommand from "../../beastie/commands";
import { handleDiscordReady } from "./ready";
import discordPosts from "./discordPosts";
import { POST_EVENT, beastieDisconnectMessage } from "../../utils/values";
import { BeastieLogger } from "../../utils/Logging";

export default class BeastieDiscordClient {
  client: Discord.Client;

  discordGuildId: string;

  discordWelcomeChId: string;
  discordTalimasFeedChId: string;

  constructor() {
    this.client = new Discord.Client();

    // Event Listeners
    this.client.on("ready", async () => {
      await this.onReady();
      BeastieLogger.debug(`I am so ready!!`);
    });

    this.client.on("message", async (message: Message) => {
      await this.onMessage(message);
    });

    this.client.on("guildMemberAdd", async (member: GuildMember) => {
      await this.onGuildMemberAdd(member);
    });

    this.client.on("disconnect", async () => {
      BeastieLogger.info("BEASTIE HAS BEEN DISCONNECTED FROM DISCORD");
      await this.onDisconnect();
    });
  }

  public async destroy() {
    BeastieLogger.info("SHUTTING DOWN ON SIGINT");
    await this.onSIGINT();
  }

  // BeastieDiscordClient Actions
  private say = async (channelId, msg) => {
    let channel: TextChannel;
    try {
      channel = (await this.client.channels.cache.get(
        channelId
      )) as TextChannel;
      if (!channel) {
        BeastieLogger.warn(`Do not have access to this channel ${channelId}`);
        return;
      }
    } catch (e) {
      BeastieLogger.warn(
        `Failed to send discord message to channel ${channelId}: ${JSON.stringify(
          e
        )}`
      );
    }

    if (Array.isArray(msg)) {
      for (const m of msg) {
        try {
          await channel.send(m, {});
        } catch (e) {
          BeastieLogger.warn(`Failed to send message: ${e}`);
        }
      }
    } else {
      try {
        await channel.send(msg, {});
      } catch (e) {
        BeastieLogger.warn(`Failed to send message: ${e}`);
      }
    }
  };

  private discordChannels = event => {
    // TODO: Add handling for different channels?
    switch (event) {
      case POST_EVENT.LIVE:
        return this.discordTalimasFeedChId;
      default:
        return this.discordTalimasFeedChId;
    }
  };

  public post = async event => {
    const msg = discordPosts(event);
    const channel = this.discordChannels(event);
    await this.say(channel, msg);
  };

  // Event Handlers
  private async onDisconnect() {}

  private async onSIGINT() {
    try {
      await this.say(this.discordTalimasFeedChId, beastieDisconnectMessage);
      await this.client.destroy();
    } catch (e) {
      BeastieLogger.warn(`Failed to send shutdown message because ${e}`);
    }
  }

  private async onReady() {
    try {
      const response = handleDiscordReady(this.client);

      this.discordGuildId = response.discordGuildId;
      this.discordWelcomeChId = response.discordWelcomeChId;
      this.discordTalimasFeedChId = response.discordTalimasFeedChId;
      try {
        await this.say(this.discordWelcomeChId, "rawr");
      } catch (e) {
        BeastieLogger.warn(
          `Failed to say rawr in ${this.discordWelcomeChId}: ${e}`
        );
      }
    } catch (e) {
      BeastieLogger.error(`Discord onReady failed: ${e}`);
    }
  }

  private onMessage = async (message: Message) => {
    if (!message.content.startsWith("!")) return;

    const [command = "!", para1 = "", para2 = ""] = message.content.split(" ");
    const guild = this.client.guilds.cache.get(message.guild.id);
    const guildMember: GuildMember = guild.members.cache.get(message.author.id);
    const roles = guildMember.roles.cache.map(role => role.name);

    const commandModule = determineCommand(
      command.slice(1),
      roles,
      guildMember.user.id
    );
    if (!commandModule) {
      return;
    }

    try {
      const response: string | void = await commandModule.execute(
        new CommandContext({
          platform: "discord",
          client: this.client,
          message: message.content,
          command,
          para1,
          para2,
          username: message.author.username + message.author.discriminator,
          displayName: message.author.username,
          roles
        })
      );

      if (response) {
        await this.say(message.channel.id, response);
      }
    } catch (e) {
      BeastieLogger.warn(`Failed to execute command: ${e}`);
    }
  };

  private onGuildMemberAdd = async (member: GuildMember) => {
    try {
      const msg = await discordPosts(
        POST_EVENT.DISCORD_MEMBER_ADD,
        member.user.toString()
      );
      await this.say(this.discordWelcomeChId, msg);
    } catch (e) {
      BeastieLogger.warn(`Failed to welcome guild member: ${e}`);
    }
  };
}
