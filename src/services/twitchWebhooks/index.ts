import TwitchWebhook from "twitch-webhook";
import twitchWebhookOptions from "./twitchWebhookOptions";
import { BeastieLogger } from "../../utils/Logging";

export default class TwitchWebhooksServer {
  server: TwitchWebhook;

  constructor() {
    this.server = new TwitchWebhook(twitchWebhookOptions);
  }

  private subscribeTwitchWebhooks = id => {
    this.server
      .subscribe("users/follows", {
        first: 1,
        to_id: id
      })
      .then(() => {
        this.server
          .subscribe("streams", {
            user_id: id
          })
          .catch(reason => {
            BeastieLogger.warn(`subscribeTwitchWebhooks failed: ${reason}`);
          });
      })
      .catch(reason => {
        BeastieLogger.warn(`subscribeTwitchWebhooks failed: ${reason}`);
      });

    // this.server.subscribe('subscriptions/events', {
    //   broadcaster_id: id,
    //   first: 1,
    // })

    // if subscription ends, resubscribe
    this.server.on("unsubscribe", obj => {
      this.server.subscribe(obj["hub.topic"]);
    });

    // unsubscribe from all when app stops
    process.on("SIGINT", () => {
      this.server
        .unsubscribe("*")
        .then(() => {
          process.exit(0);
        })
        .catch(reason => {
          BeastieLogger.warn(`Errored during SIGINT twitchWebhooks ${reason}`);
          process.exit(0);
        });
    });
  };

  public connect = id => {
    this.subscribeTwitchWebhooks(id);
  };
}
