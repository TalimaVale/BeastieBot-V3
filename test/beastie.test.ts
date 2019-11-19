require("source-map-support").install();
jest.mock("../src/services/discord", () =>
  require("../src/services/__mocks__/discord")
);
jest.mock("../src/services/twitch", () =>
  require("../src/services/__mocks__/twitch")
);
jest.mock("../src/services/twitchWebhooks", () =>
  require("../src/services/__mocks__/twitchWebhooks")
);
jest.mock("../src/services/twitter");
jest.mock("../src/services/utils");

import refs from "./fixtures/beastie";
import agent from "supertest-koa-agent";

describe("BEASTIE RAWR TEST!", () => {
  test("beastie starts up correctly", async () => {
    await refs.beastie.start();
    expect(refs.beastie.discordClient.login).toBeCalled();
  });
});
