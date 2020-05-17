import config from "../../../config";

export const handleDiscordReady = discordClient => {
  const guild = discordClient.guilds.cache.find(
    g => g.name === config.DISCORD_GUILD_NAME
  );
  if (!guild) {
    throw `Could not find guild specified ${config.DISCORD_GUILD_NAME}`;
  }

  // get guild
  const discordGuildId = guild.id;

  // get welcome channel
  const discordWelcomeChId = guild.channels.cache.find(
    ch => ch.name === config.DISCORD_WELCOME_CHANNEL
  ).id;

  // get talimas-feed channel
  const discordTalimasFeedChId = guild.channels.cache.find(
    ch => ch.name === config.DISCORD_FEED_CHANNEL
  ).id;

  return { discordGuildId, discordWelcomeChId, discordTalimasFeedChId };
};
