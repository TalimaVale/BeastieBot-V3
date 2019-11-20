/*
BeastieBot, Twitch Community Activity

Raid another streamer's chatroom and post the raid message. Broadcaster's chatroom chatters receive awesomeness points equal to the amount of raid messages posted.
RULES: 1) Raid message must be posted by raidTeam member, 2) One raid message per raidTeam member counted.

!startraid - broadcaster activates raid and enables !joinraid command
!joinraid - adds user to raidTeam and whispers user to confirm
raidTeam: Array<string> - TwitchClient property
raidMessage: string - TwitchClient property
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
  const startMsg = `${startRaidMessage} Current raid team: ${
    twitchService.raidTeam.length
  }`;
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

export const startRaiding = (
  twitchService,
  target,
  targetDisplayName,
  viewers
) => {
  joinHostedChannel(twitchService.client, target, viewers);
  twitchService.hostedChannel = target;

  const startMsg = activeRaidMessage(targetDisplayName);
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
