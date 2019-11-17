import config from "../../config";

const twitchWebhookOptions = {
  client_id: config.CLIENT_ID,
  callback: "https://5df592dd.ngrok.io", // use IP of lightsail, or subdomain
  secret: "ashiuewjkbfvekudgvekgvbjaerf",
  lease_seconds: 3600, // default: 864000 (max value)
  listen: {
    port: config.TWITCH_WEBHOOKS_SERVER_PORT // default: 8443
  }
};

export default twitchWebhookOptions;
