import path from "path";
require("dotenv").config({ path: path.join(__dirname, ".env.test") });
import BeastieBot from "../../src/beastie";

interface RefType {
  beastie: BeastieBot;
}

const refs: RefType = {
  beastie: null
};

beforeAll(async () => {
  try {
    refs.beastie = await BeastieBot.create();
  } catch (e) {
    console.error("NANI?? We have an error...", e);
    throw e;
  }
});

afterAll(() => {});

export default refs;
