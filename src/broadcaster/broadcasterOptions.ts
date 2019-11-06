import config from "../config";

const broadcasterOptions = {
  options: {
    debug: true
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: config.BROADCASTER_USERNAME,
    password: config.BROADCASTER_PASSWORD
  },
  channels: [config.BROADCASTER_USERNAME]
};

export default broadcasterOptions;
