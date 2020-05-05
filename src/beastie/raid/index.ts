/*
Encourage team to participate
Reward awesomeness per teammate that raids

onMessage !startraid - enable ActiveRaid, listen for !joinraid, post start message, post raid message
onMessage !joinraid - add message sender to RaidTeam[], whisper message sender
on /host username - if ActiveRaid, start raid timer, then post link to username's channel, post raid message, join username's channel, post hello message, listen to username's channel messages
username onMessage - if message equals raid message, then if message sender is on RaidTeam[], then increment RaidTeamReward, Remove message sender from RaidTeam[]
raid timer ends - post goodbye message, leave username channel, reward chatters RaidTeamReward awesomeness, empty RaidTeam[], set RaidTeamReward to 0, disable ActiveRaid
*/

import {
  startRaidMessage,
  raidMessage,
  joinRaidTeamSuccessWhisper,
  joinRaidTeamFailWhisper,
  hostedChannelGreeting,
  activeRaidMessage,
  hostedChannelGoodbye,
  endRaidMessage
} from "../../utils/values";

export const startRaidTeam = twitchService => {
  twitchService.activeRaid = true;
  const startMsg = startRaidMessage;
  const raidMsg = raidMessage;
  return [startMsg, raidMsg];
};

export const joinRaidTeam = (twitchService, tags) => {
  if (twitchService.activeRaid) {
    twitchService.raidTeam.push(tags["user-id"]);
    return joinRaidTeamSuccessWhisper;
  } else {
    return joinRaidTeamFailWhisper;
  }
};

const joinHostedChannel = (client, target, viewers) => {
  client.join(target);
  const msg = hostedChannelGreeting(viewers);
  client.say(target, msg);
};

export const startRaiding = (twitchService, target, viewers) => {
  joinHostedChannel(twitchService.client, target, viewers);
  twitchService.hostedChannel = target;

  const startMsg = activeRaidMessage(target);
  const raidMsg = raidMessage;

  return [startMsg, raidMsg];
};

export const checkForRaidMessage = (twitchService, channel, tags, message) => {
  if (
    channel === `#${twitchService.hostedChannel}` &&
    message === twitchService.raidMessage &&
    twitchService.raidTeam.includes(tags["user-id"])
  ) {
    twitchService.raidReward++;
    const index = twitchService.raidTeam.indexOf(tags["user-id"]);
    twitchService.raidTeam.splice(index, 1);
  }
};

export const endRaid = (client, target, reward) => {
  client.say(target, hostedChannelGoodbye);
  client.leave(target);

  const endMsg = endRaidMessage;
  const rewardMsg = `!bonus ${reward}`;

  const activeRaid = false;
  const raidTeam = [];
  const raidReward = 0;

  return { activeRaid, raidTeam, raidReward, messages: [endMsg, rewardMsg] };
};
