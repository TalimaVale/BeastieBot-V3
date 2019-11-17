import * as yup from "yup";

interface Config {
  PORT: number;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  BEASTIE_USERNAME: string;
  BEASTIE_PASSWORD: string;
  BROADCASTER_USERNAME: string;
  BROADCASTER_PASSWORD: string;
  DATABASE_TEAMMATE_TABLE: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_TOKEN: string;
  DISCORD_GUILD_NAME: string;
  TWITTER_CONSUMER_KEY: string;
  TWITTER_CONSUMER_SECRET: string;
  TWITTER_ACCESS_TOKEN_KEY: string;
  TWITTER_ACCESS_TOKEN_SECRET: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
}

const config = yup.object().shape({
  PORT: yup
    .number()
    .integer()
    .required(),

  // -> https://dev.twitch.tv/console/apps
  CLIENT_ID: yup.string().required(),
  CLIENT_SECRET: yup.string().required(),
  BEASTIE_USERNAME: yup.string().required(),
  BEASTIE_PASSWORD: yup
    .string()
    .test(
      "beastie oauth token",
      // oauth can be acquired from -> https://twitchapps.com/tmi/
      'BEASTIE_PASSWORD should be an oauth token (prefixed with "oauth:")',
      value => value.startsWith("oauth:")
    )
    .required(),
  BROADCASTER_USERNAME: yup.string().required(),
  BROADCASTER_PASSWORD: yup
    .string()
    .test(
      "broadcaster oauth token",
      // oauth can be acquired from -> https://twitchapps.com/tmi/
      'BROADCASTER_PASSWORD should be an oauth token (prefixed with "oauth:")',
      value => value.startsWith("oauth:")
    )
    .required(),
  DATABASE_TEAMMATE_TABLE: yup.string().required(),

  // -> https://discordapp.com/developers/applications
  DISCORD_CLIENT_ID: yup.string().required(),
  DISCORD_CLIENT_SECRET: yup.string().required(),
  DISCORD_TOKEN: yup.string().required(),
  DISCORD_GUILD_NAME: yup.string().default("teamTALIMA"),

  // -> https://developer.twitter.com/en/apps
  TWITTER_CONSUMER_KEY: yup.string(),
  TWITTER_CONSUMER_SECRET: yup.string(),
  TWITTER_ACCESS_TOKEN_KEY: yup.string(),
  TWITTER_ACCESS_TOKEN_SECRET: yup.string(),
  // -> https://developer.spotify.com/dashboard/applications
  SPOTIFY_CLIENT_ID: yup.string(),
  SPOTIFY_CLIENT_SECRET: yup.string()
});

export default <Config>config.validateSync(process.env, { stripUnknown: true });
