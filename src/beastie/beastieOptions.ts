import config from "../config";

const beastieOptions = {
  options: {
    clientId: config.CLIENT_ID,
    debug: true
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: config.BEASTIE_USERNAME,
    password: config.BEASTIE_PASSWORD
  },
  channels: [config.BROADCASTER_USERNAME]
};

export default beastieOptions;
