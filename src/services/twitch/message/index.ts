import { determineBonus } from './bonus'
import { greetings, sayBeastieGreeting } from './greetings'
import { startRaidTeam, joinRaidTeam } from '../../../beastie/raid'
//import redeemReward, { aliases as rewardsArray } from '../commands/redeem'
import {
  redeemReward,
  rewardsArray,
  attemptRedeemReward,
} from '../../../beastie/rewards'

export const COMMANDS = {
  GREETING: 'greeting',
  BONUS: 'bonus',
  BONUS_ALL: 'bonusall',
  START_RAID: 'startraid',
  JOIN_RAID: 'joinraid',
  TWITTER_POST: 'twitterpost',
  REDEEM: 'redeem',
  REWARD: 'reward',
}

export const BADGES = {
  TEAMMATE: 'teammate',
  STAFF: 'staff',
  SUBSCRIBER: 'subscriber',
  MODERATOR: 'moderator',
  BROADCASTER: 'broadcaster',
}

const determineCommandAction = (beastie, badge, commandType, command, tags) => {
  switch (true) {
    // TEAMMATE commands
    case commandType === COMMANDS.GREETING:
      return sayBeastieGreeting(tags, badge, command)
    case commandType === COMMANDS.JOIN_RAID:
      return joinRaidTeam(beastie, tags)
    case commandType === COMMANDS.REDEEM:
      return redeemReward(beastie, tags, command)
    case commandType === COMMANDS.REWARD:
      return attemptRedeemReward()
    // SUBSCRIBER commands
    //
    // MODERATOR commands
    case commandType === COMMANDS.START_RAID &&
      (badge === BADGES.MODERATOR || badge === BADGES.BROADCASTER):
      return startRaidTeam(beastie)
    // BROADCASTER commands
    case commandType === COMMANDS.BONUS && badge === BADGES.BROADCASTER:
      determineBonus(command)
      return
    case commandType === COMMANDS.BONUS_ALL && badge === BADGES.BROADCASTER:
      determineBonus(command)
      return
    case commandType === COMMANDS.TWITTER_POST && badge === BADGES.BROADCASTER:
      console.log(`post 'command message' to twitter`)
      return
    default:
      return
  }
}

const getBadge = tags => {
  if (tags.badges) {
    if (tags.badges.hasOwnProperty('broadcaster')) return BADGES.BROADCASTER
    if (tags.badges.hasOwnProperty('staff')) return BADGES.STAFF
    if (tags.badges.hasOwnProperty('moderator')) return BADGES.MODERATOR
    if (tags.badges.hasOwnProperty('subscriber')) return BADGES.SUBSCRIBER
  } else return BADGES.TEAMMATE
}

const determineCommandType = (command: string) => {
  if (greetings.has(command)) return COMMANDS.GREETING
  if (command.startsWith(COMMANDS.BONUS)) return COMMANDS.BONUS
  if (command.startsWith(COMMANDS.BONUS_ALL)) return COMMANDS.BONUS_ALL
  if (command === COMMANDS.START_RAID) return COMMANDS.START_RAID
  if (command === COMMANDS.JOIN_RAID) return COMMANDS.JOIN_RAID
  if (command === COMMANDS.TWITTER_POST) return COMMANDS.TWITTER_POST
  if (command === COMMANDS.REDEEM || command.startsWith(COMMANDS.REDEEM))
    return COMMANDS.REDEEM
  if (
    rewardsArray.some(
      reward => command === reward || command.startsWith(reward + ' ')
    )
  )
    return COMMANDS.REWARD
}

const getCommand = message => {
  return message.toLowerCase().slice(1)
}

export const determineBeastieResponse = async (beastie, tags, message) => {
  if (message[0] !== '!') return
  const command = getCommand(message)
  const commandType = determineCommandType(command)
  const badge = getBadge(tags)
  return determineCommandAction(beastie, badge, commandType, command, tags)
}
