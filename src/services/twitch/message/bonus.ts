import { COMMANDS } from './index'
import {
  updateTeammateAwesomeness,
  updateChattersAwesomeness,
} from '../../../utils'

export const determineBonus = command => {
  if (command.substring(0, 5) === COMMANDS.BONUS) {
    const message = command.slice(6)
    const username = message.substr(0, message.indexOf(' '))
    const bonus = parseInt(message.substr(message.indexOf(' ') + 1))
    if (typeof bonus === 'number') updateTeammateAwesomeness(username, bonus)
  }
  if (command.substring(0, 8) === COMMANDS.BONUS_ALL) {
    const bonus = parseInt(command.substr(command.indexOf(' ' + 1)))
    if (typeof bonus === 'number') updateChattersAwesomeness(bonus)
  }
}
