require("source-map-support").install();
require("dotenv").config();

import { BeastieLogger } from "./utils/Logging";

process.on("unhandledRejection", (reason, p) => {
  BeastieLogger.error(`Unhandled Rejection at: Promise ${p} reason: ${reason}`);
  throw reason;
});

import Beastie from "./beastie";

Beastie.create()
  .then(beastie => {
    beastie
      .start()
      .then(() => {
        BeastieLogger.info("BeastieBot is alive! RAWR");
      })
      .catch(reason => {
        BeastieLogger.error(`Beastie failed to start because: ${reason}`);
        process.exit(2);
      });
  })
  .catch(reason => {
    BeastieLogger.error(`Failed to create beastie because: ${reason}`);
    process.exit(1);
  });
