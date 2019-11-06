import config from "../config";

const twitchWebhookOptions = {
  client_id: config.CLIENT_ID,
  callback: "https://cc58371e.ngrok.io", // use IP of lightsail, or subdomain
  secret: "rijrlejel4843kaabbwmidj",
  lease_seconds: 3600, // default: 864000 (max value)
  listen: {
    port: config.PORT // default: 8443
  }
};

export default twitchWebhookOptions;
