// Beastie Faces (Emotes)
export const beastieFaceTwitchEmotes = [
  "OhMyDog",
  "OhMyDog",
  "OhMyDog",
  "OhMyDog",
  "OhMyDog",
  ":)",
  ":D",
  ";P",
  "BloodTrail",
  "CoolCat",
  "OSFrog",
  "SeriousSloth",
  "KomodoHype",
  "RaccAttack",
  "SSSsss",
  "teamta1RAWR"
];

export const beastieFaceDiscordEmotes = [
  ":smiling_imp:",
  ":smiling_imp:",
  ":smiling_imp:",
  ":alien:",
  ":smiley_cat:",
  ":smirk_cat:",
  ":dog:",
  ":fox:",
  ":bear:",
  ":koala:",
  ":tiger:",
  ":eagle:",
  ":wolf:",
  ":wolf:",
  ":wolf:",
  ":t_rex:",
  ":crocodile:",
  ":shark:",
  ":rhino:",
  ":raccoon:",
  ":dragon:",
  ":dragon:",
  ":dragon:",
  ":dragon:",
  ":dragon_face:",
  ":dragon_face:",
  ":dragon_face:",
  ":dragon_face:",
  ":wave:",
  ":wave:",
  "<:talSalute:287925661350494210>",
  "<:talSalute:287925661350494210>",
  "<:teamta1RAWR:704871701992702013>",
  "<:teamta1RAWR:704871701992702013>",
  "<:teamta1RAWR:704871701992702013>",
  "<:teamta1RAWR:704871701992702013>"
];

// Beastie Connect and Disconnect
export const beastieConnectMessage = `Hello team! I have awoken :D rawr`;
export const beastieDisconnectMessage = `Goodbye team :) rawr`;

// Social Post Events
export enum POST_EVENT {
  "LIVE",
  "NONE",
  "DISCORD_MEMBER_ADD",
  "TWITCH_NEW_SUB",
  "TWITCH_NEW_FOLLOW",
  "TWITCH_HOSTING",
  "END_OF_STREAM"
}

// Twitch Intervals Feature
export const awesomenessInterval = 1000 * 60 * 5; // KEEP MILLISECONDS, used by database
export const awesomenessIntervalAmount = 5;

export const discordInterval = 1000 * 60 * 20;
export const discordIntervalMessage = `Hey team! Make sure you don't miss out on joining our Discord guild! Talima hosts voice chats and we organize dev projects on Discord! https://discord.gg/yBXqgus`;

// Raid Feature
export const raidTimer = 1000 * 60;
export const raidMessage = ` RAWR twitchRaid RAWR twitchRaid RAWR twitchRaid RAWR twitchRaid`;

export const startRaidMessage = `Time to raid! Join the raid team with !joinraid to receive bonus awesomeness in our channel at the end of the raid!`;
export const joinRaidTeamSuccessWhisper = `You have successfully joined the raid team!`;
export const joinRaidTeamFailWhisper = `We are not raiding right now. There is no active raid team. :)`;
export const activeRaidMessage = target =>
  `Our Raid Has Begun! Hurry raid team! Join ${target}'s channel and post the raid message!`;
export const hostedChannelGreeting = viewers =>
  `Hello Friend! I am BeastieBot and you are being raided by myself and ${viewers} teammates of teamTALIMA! RAWR`;
export const hostedChannelGoodbye = `Goodbye Friend! I must go home now. Hope you have an awesome stream! :)`;
export const endRaidMessage = `The raid is over! Great raid team, and thanks for participating today! Here's our raid reward! :D`;

// Discord Guild and Channel Names {
export const discordGuild = {
  guildName: "teamTALIMA",
  welcomeCh: "general",
  talimasFeedCh: "talimas-feed"
};
