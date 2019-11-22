import { songQueueNoSongMessage } from '../../utils/values'

const findSong = async (spotifyClient, songName) => {
  const responseData = await spotifyClient.searchTracks(songName, {
    limit: 1,
  })
  // http://michaelthelin.se/spotify-web-api-node/
  const { tracks: { items = [] } = {} } = responseData.body
  const [song] = items
  if (song === undefined) return null

  return {
    songId: song.id,
    songName: song.name,
    artistName: (song.artists.find(artist => !!artist) || {}).name,
  }

  return null
}

export const redeemSongRequest = async (beastie, tags, rewardParamsArray) => {
  console.log(rewardParamsArray)
  if (rewardParamsArray.length === 0) return songQueueNoSongMessage

  const songName = rewardParamsArray.join(' ')

  const song = await findSong(beastie.spotifyClient, songName)

  // if (song === undefined) {
  //   return `Sorry, song lookup failed. :(`
  // } else if (song === null) {
  //   return `@${
  //     tags.username
  //   } Sorry, that song couldn't be found. Maybe try again with some adjustments?`
  // }

  return //`@${tags.username} ("${song.songName}" by ${song.artistName}) will be added to a request queue. Thank you for the song request!`
  // TODO actually add the song request to the queue!
}

export const redeemSongPlay = async (beastie, tags, rewardParamsArray) => {
  // const songName = rewardParamsArray.join(' ').trim()
  // if (songName === '') return `@${tags.username} No song name provided.`

  // const song = await findSong(beastie.spotifyClient, songName).catch(
  //   () => undefined
  // )
  // if (song === undefined) {
  //   return `Sorry, song lookup failed. :(`
  // } else if (song === null) {
  //   return `@${
  //     tags.username
  //   } Sorry, that song couldn't be found. Maybe try again with some adjustments?`
  // }
  return //`Song found within Spotify! OhMyDog But this feature isn't implemented yet! Thank you and please check back again later!`
}
