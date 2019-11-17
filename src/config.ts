import * as yup from "yup";

interface Config {
  PORT: number;
  TWITCH_WEBHOOKS_SERVER_PORT: number;
  STREAM_OVERLAY_SERVER_PORT: number;
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
  TWITTER_CONSUMER_KEY: string;
  TWITTER_CONSUMER_SECRET: string;
  TWITTER_ACCESS_TOKEN_KEY: string;
  TWITTER_ACCESS_TOKEN_SECRET: string;
}

const config = yup.object().shape({
  PORT: yup
    .number()
    .integer()
    .required(),
  TWITCH_WEBHOOKS_SERVER_PORT: yup
    .number()
    .integer()
    .required(),
  STREAM_OVERLAY_SERVER_PORT: yup
    .number()
    .integer()
    .required(),
  CLIENT_ID: yup.string().required(),
  CLIENT_SECRET: yup.string().required(),
  BEASTIE_USERNAME: yup.string().required(),
  BEASTIE_PASSWORD: yup.string().required(),
  BROADCASTER_USERNAME: yup.string().required(),
  BROADCASTER_PASSWORD: yup.string().required(),
  DATABASE_TEAMMATE_TABLE: yup.string().required(),
  DISCORD_CLIENT_ID: yup.string().required(),
  DISCORD_CLIENT_SECRET: yup.string().required(),
  DISCORD_TOKEN: yup.string().required(),
  TWITTER_CONSUMER_KEY: yup.string().required(),
  TWITTER_CONSUMER_SECRET: yup.string().required(),
  TWITTER_ACCESS_TOKEN_KEY: yup.string().required(),
  TWITTER_ACCESS_TOKEN_SECRET: yup.string().required()
});

export default <Config>config.validateSync(process.env, { stripUnknown: true });
