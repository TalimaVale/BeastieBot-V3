import { EventEmitter } from "events";

class MocksServer extends EventEmitter {}

export default class TwitchWebhooksServer {
  server = new MocksServer();

  public connect(id) {
    console.log(`TWITCHWEBHOOKS MOCK - connect(id), id = ${id}`);
  }
}
