import path from "path";
require("dotenv").config({ path: path.join(__dirname, ".env.test") });
import config from "../../src/config";
import app from "../../src/app";
import { Server } from "http";

interface RefType {
  server: Server;
}

const refs: RefType = {
  server: null
};

beforeAll(
  () =>
    new Promise(resolve => {
      refs.server = app.listen(config.PORT, resolve);
    })
);

afterAll(() => new Promise(resolve => refs.server.close(resolve)));

export default app;
