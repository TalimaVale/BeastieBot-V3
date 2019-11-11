import { discordGuild } from "../../../utils/values";

export const handleDiscordReady = discordClient => {
  // get guild
  const discordGuildId = discordClient.guilds.find(
    g => g.name === discordGuild.guildName
  ).id;

  // get welcome channel
  const discordWelcomeChId = discordClient.guilds
    .get(discordGuildId)
    .channels.find(ch => ch.name === discordGuild.welcomeCh).id;

  // get announcements channel
  const discordAnnouncementsChId = discordClient.guilds
    .get(discordGuildId)
    .channels.find(ch => ch.name === discordGuild.announcementsCh).id;

  return { discordGuildId, discordWelcomeChId, discordAnnouncementsChId };
};
