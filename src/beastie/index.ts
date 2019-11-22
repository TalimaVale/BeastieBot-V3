import config from '../config'
import BeastieTwitchClient from '../services/twitch'
import TwitchWebhooksServer from '../services/twitchWebhooks'
import StreamOverlayServer from './streamOverlay'
import BeastieDiscordClient from '../services/discord'
import BeastieTwitterClient from '../services/twitter'
import BeastieSpotifyClient from '../services/spotify'
import { getId, initStream } from '../utils'
import { POST_EVENT } from '../utils/values'
import handleStreamChange from '../services/twitchWebhooks/streamChange'

interface StateType {
  isStreaming: boolean
  curStreamId: number
}

export default class BeastieBot {
  state: StateType

  twitchClient: BeastieTwitchClient
  twitchWebhooks: TwitchWebhooksServer
  streamOverlay: StreamOverlayServer
  discordClient: BeastieDiscordClient
  twitterClient: BeastieTwitterClient
  spotifyClient: BeastieSpotifyClient

  broadcasterId: number

  private constructor() {}

  public static async create() {
    const beastie = new BeastieBot()

    beastie.state = {
      isStreaming: false,
      curStreamId: 0,
    }

    beastie.twitchClient = beastie.initTwitch()
    beastie.broadcasterId = await getId(config.BROADCASTER_USERNAME)
    beastie.twitchWebhooks = beastie.initTwitchWebhooks()
    beastie.streamOverlay = await beastie.initStreamOverlay()
    beastie.discordClient = beastie.initDiscord()
    beastie.twitterClient = beastie.initTwitter()
    beastie.spotifyClient = beastie.initSpotify()

    beastie.state = await beastie.initState()

    console.log('init finished')
    return beastie
  }

  initTwitch() {
    const twitchClient = new BeastieTwitchClient()

    // Twitch Event Listeners that affect other services

    console.log('twitch init finished')
    return twitchClient
  }

  initTwitchWebhooks() {
    const twitchWebhooks = new TwitchWebhooksServer()
    twitchWebhooks.connect(this.broadcasterId)

    // Twitch Webhooks Event Listeners that affect other services
    twitchWebhooks.server.on('streams', payload => {
      this.onStreamChange(payload)
    })

    twitchWebhooks.server.on('users/follows', payload => {
      this.onFollow(payload)
    })
    twitchWebhooks.server.on('subscriptions/events', payload => {
      this.onSubscribe(payload)
    })

    console.log('webhooks init finished')
    return twitchWebhooks
  }

  initStreamOverlay() {
    const streamOverlay = new StreamOverlayServer()

    // Twitch Overlay Event Listeners that affect other services

    console.log('overlay init finished')
    return streamOverlay
  }

  initDiscord() {
    const discordClient = new BeastieDiscordClient()

    console.log(`discord init finished`)
    return discordClient
  }

  initTwitter() {
    const twitterClient = new BeastieTwitterClient()

    // Twitter Event Listeners that affect other services

    console.log('twitter init finished')
    return twitterClient
  }

  initSpotify = () => {
    const spotifyClient = new BeastieSpotifyClient()

    console.log('spotify init finished')
    return spotifyClient
  }

  initState = async () => {
    const stream = await initStream()

    console.log('state init finished')
    return {
      ...this.state,
      isStreaming: stream.live,
      curStream: stream.id,
    }
  }

  public async start() {
    await this.twitchClient.connect()
    await this.discordClient.login(config.DISCORD_TOKEN)
    this.twitchClient.toggleStreamIntervals(this.state.isStreaming)
  }

  private onStreamChange(payload) {
    const stream = payload.data[0]
    const response = handleStreamChange(stream, this.state.curStreamId)

    this.state.isStreaming = response.live
    this.state.curStreamId = response.streamId

    if (response.newStream) {
      this.twitterClient.post(POST_EVENT.LIVE, this.state.curStreamId)
      this.discordClient.post(POST_EVENT.LIVE)
    } else if (!this.state.isStreaming) {
      // post to twitch 'Goodbye, thanks for watching'
    }
    // handle title change
    // handle game_id change

    this.twitchClient.toggleStreamIntervals(this.state.isStreaming)
  }

  private onFollow(payload) {
    const { from_name } = payload.event.data[0]
    this.twitchClient.post(POST_EVENT.TWITCH_NEW_FOLLOW, from_name)
    // twitter and discord post for follow milestones per stream

    // EMIT FOLLOW EVENT TO OVERLAY/CLIENT/FRONT END

    this.streamOverlay.io.emit('newFollower', from_name)
  }

  private onSubscribe(payload) {
    const { user_name } = payload.event.data[0].event_data
    this.twitchClient.post(POST_EVENT.TWITCH_NEW_SUB, user_name)
    // twitter and discord post for subscriber milestones per stream
  }
}
