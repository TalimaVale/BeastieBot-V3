import config from "../../../config";
import SpotifyWebApi from "spotify-web-api-node";
const spotifyApiClient = config.SPOTIFY_CLIENT_ID
  ? new SpotifyWebApi({
      clientId: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
      redirectUri: null
    })
  : null;

const renewSpotifyAccessToken = async () => {
  let renewalTime = 15 * 60;
  try {
    const data = await spotifyApiClient.clientCredentialsGrant();
    const { access_token, expires_in = 60 * 60 } = data.body;
    // console.log({ access_token });

    if (!isNaN(parseInt(expires_in, 10)))
      renewalTime = parseInt(expires_in, 10);

    if (access_token) {
      spotifyApiClient.setAccessToken(access_token);
    }
  } catch (error) {
    console.log(`error: spotify: failed to acquire client credentials grant:`, {
      error
    });
    throw error;
  } finally {
    setTimeout(
      renewSpotifyAccessToken,
      Math.max((renewalTime - 60) * 1000, 20 * 1000)
    );
  }
};
renewSpotifyAccessToken();

// spotifyApiClient.setAccessToken(config.SPOTIFY_ACCESS_TOKEN);

const findSong = async songName => {
  if (!spotifyApiClient) return;

  try {
    const responseData = await spotifyApiClient.searchTracks(songName, {
      limit: 1
    });
    const responseBody = responseData.body;
    const { tracks: { items = [] } = {} } = responseBody;
    const [song] = items;
    if (song === undefined) return null;

    return {
      songId: song.id,
      songName: song.name,
      artistName: (song.artists.find(artist => !!artist) || {}).name
    };
  } catch (error) {
    console.log("findSong error:", error);
    throw error;
  }
  return null;
};

const rewards = new Map([
  [
    "songrequest",
    async ({ tags, rewardParameters }) => {
      const songName = rewardParameters.join(" ").trim();
      if (songName === "") return `@${tags.username} No song name provided.`;

      const song = await findSong(songName).catch(() => undefined);
      if (song === undefined) {
        return `Sorry, song lookup failed. :(`;
      } else if (song === null) {
        return `@${
          tags.username
        } Sorry, that song couldn't be found. Maybe try again with some adjustments?`;
      }

      return `@${tags.username} ("${song.songName}" by ${
        song.artistName
      }) will be added to a request queue. Thank you for the song request!`;
      // TODO actually add the song request to the queue!
    }
  ],
  [
    "songplay",
    async ({ tags, rewardParameters }) => {
      const songName = rewardParameters.join(" ").trim();
      if (songName === "") return `@${tags.username} No song name provided.`;

      const song = await findSong(songName).catch(() => undefined);
      if (song === undefined) {
        return `Sorry, song lookup failed. :(`;
      } else if (song === null) {
        return `@${
          tags.username
        } Sorry, that song couldn't be found. Maybe try again with some adjustments?`;
      }
      return `Song found within Spotify! OhMyDog But this feature isn't implemented yet! Thank you and please check back again later!`;
    }
  ],
  [
    "rewards",
    async ({ tags }) => {
      const omittedRewards = ["rewards"];
      return `@${
        tags.username
      } Here's a the rewards you can redeem from chat: ${Array.from(
        rewards.keys()
      )
        .filter((reward: string) => !omittedRewards.includes(reward))
        .join(", ")}`;
    }
  ]
]);

export default function redeemCommand({ tags, message = "!redeem rewards" }) {
  if (!message.startsWith("!redeem ") && message !== "!redeem") {
    message = `!redeem ${message.slice(1)}`;
  }

  let [, reward = "rewards", ...rewardParameters] = message.split(/\s+/);
  if (reward === "" && rewardParameters.length === 0) {
    reward = "rewards";
  }

  if (rewards.has(reward)) {
    const redeemableReward = rewards.get(reward);
    return redeemableReward({
      tags,
      message,
      reward,
      rewardParameters
    });
  }
  return `@${tags.username} Sorry, I don't recognize that as a reward.`;
}
// export const aliases = Array.from(rewards.keys());
export const aliases = ["songrequest", "songplay"];
