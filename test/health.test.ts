import app from "./fixtures/app";
import agent from "supertest-koa-agent";

describe("Health tests", () => {
  test("health check returns ok", () =>
    agent(app)
      .get("/health-check")
      .expect(200));
});
