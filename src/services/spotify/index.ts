import SpotifyWebApi from 'spotify-web-api-node'
import config from '../../config'

export default class BeastieSpotifyService {
  client: SpotifyWebApi

  constructor() {
    this.client = new SpotifyWebApi({
      clientId: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
      redirectUri: null,
    })
  }
}

// const renewSpotifyAccessToken = async () => {
//   let renewalTime = 15 * 60
//   try {
//     const data = await spotifyApiClient.clientCredentialsGrant()
//     const { access_token, expires_in = 60 * 60 } = data.body
//     // console.log({ access_token });

//     if (!isNaN(parseInt(expires_in, 10))) renewalTime = parseInt(expires_in, 10)

//     if (access_token) {
//       spotifyApiClient.setAccessToken(access_token)
//     }
//   } catch (error) {
//     console.log(`error: spotify: failed to acquire client credentials grant:`, {
//       error,
//     })
//     throw error
//   } finally {
//     setTimeout(
//       renewSpotifyAccessToken,
//       Math.max((renewalTime - 60) * 1000, 20 * 1000)
//     )
//   }
// }
// renewSpotifyAccessToken()

// // spotifyApiClient.setAccessToken(config.SPOTIFY_ACCESS_TOKEN);
