import config from "../config";

// Beastie Faces (Emotes)
export const beastieFaceEmotes = [
  "OhMyDog",
  ":)",
  ":D",
  ";P",
  "OhMyDog",
  "BloodTrail",
  "CoolCat",
  "OSFrog",
  "OhMyDog",
  "SeriousSloth",
  "KomodoHype",
  "RaccAttack",
  "OhMyDog",
  "SSSsss",
  "OhMyDog"
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
  "TWITCH_HOSTING"
}

// Twitch Intervals Feature
export const awesomenessInterval = 1000 * 5 * 60; // add 60 when not testing
export const awesomenessIntervalAmount = 1;

export const discordInterval = 1000 * 60 * 30;
export const discordIntervalMessage = `Hey team! Make sure you don't miss out on joining our Discord guild! Talima hosts voice chats and we organize dev projects on Discord! https://discord.gg/yBXqgus`;

// Raid Feature
export const raidTimer = 1000 * 60;
export const raidMessage = `yolo!!`;

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
  guildName: config.DISCORD_GUILD_NAME || "teamTALIMA",
  welcomeCh: "general",
  announcementsCh: "announcements"
};
