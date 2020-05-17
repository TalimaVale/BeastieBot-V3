import { discordGuild } from "../../../utils/values";

export const handleDiscordReady = discordClient => {
  const guild = discordClient.guilds.cache.find(
    g => g.name === discordGuild.guildName
  );
  if (!guild) {
    throw `Could not find guild specified ${discordGuild.guildName}`;
  }

  // get guild
  const discordGuildId = guild.id;

  // get welcome channel
  const discordWelcomeChId = guild.channels.cache.find(
    ch => ch.name === discordGuild.welcomeCh
  ).id;

  // get talimas-feed channel
  const discordTalimasFeedChId = guild.channels.cache.find(
    ch => ch.name === discordGuild.talimasFeedCh
  ).id;

  return { discordGuildId, discordWelcomeChId, discordTalimasFeedChId };
};
