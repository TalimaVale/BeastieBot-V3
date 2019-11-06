import TwitchWebhook from "twitch-webhook";
import twitchWebhookOptions from "./twitchWebhookOptions";
import { EventEmitter } from "events";

export default class Webhooks extends EventEmitter {
  twitchWebhook: TwitchWebhook;

  private subscribeTwitchWebhooks = id => {
    this.twitchWebhook.subscribe("users/follows", {
      first: 1,
      to_id: id
    });

    this.twitchWebhook.subscribe("streams", {
      user_id: id
    });

    // this.twitchWebhook.subscribe('subscriptions/events', {
    //   broadcaster_id: id,
    //   first: 1,
    // })

    this.twitchWebhook.on("users/follows", payload => {
      this.emit("follow", payload);
    });

    this.twitchWebhook.on("streams", payload => {
      this.emit("stream", payload);
    });

    this.twitchWebhook.on("subscriptions/events", payload => {
      this.emit("subscribe", payload);
    });

    // if subscription ends, resubscribe
    this.twitchWebhook.on("unsubscribe", obj => {
      this.twitchWebhook.subscribe(obj["hub.topic"]);
    });

    // unsubscribe from all when app stops
    process.on("SIGINT", () => {
      this.twitchWebhook.unsubscribe("*");
      process.exit(0);
    });
  };

  constructor() {
    super();
    this.twitchWebhook = new TwitchWebhook(twitchWebhookOptions); // NGROK needs to be current
  }

  public connect(id) {
    this.subscribeTwitchWebhooks(id);
  }
}
