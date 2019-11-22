import {
  listRewardsMessage,
  attemptRedeemRewardMessage,
} from '../../utils/values'
import { redeemSongRequest, redeemSongPlay } from './songQueue'

const rewards = {
  songrequest: redeemSongRequest,
  songplay: redeemSongPlay,
}

export const rewardsArray = Array.from(Object.keys(rewards))

// command could be: 'redeem', 'redeem xxx'
export const redeemReward = (beastie, tags, command = '!redeem') => {
  if (command === 'redeem') return listRewardsMessage(rewardsArray)

  const [, reward, ...rewardParams] = command.split(' ')
  console.log(rewardParams)

  if (rewardsArray.includes(reward)) {
    return rewards[reward](beastie, tags, rewardParams)
  }

  return `@${tags.username} Sorry, I don't recognize that as a reward.`
}

export const attemptRedeemReward = () => {
  return attemptRedeemRewardMessage
}
