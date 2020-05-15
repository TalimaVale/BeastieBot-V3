require("source-map-support").install();
require("dotenv").config();

import { BeastieLogger } from "./utils/Logging";

process.on("unhandledRejection", (reason, p) => {
  BeastieLogger.error(
    `Unhandled Rejection at: Promise ${JSON.stringify(
      p
    )} reason: ${JSON.stringify(reason)}`
  );
  throw reason;
});

import Beastie from "./beastie";

Beastie.create()
  .then(beastie => {
    beastie
      .start()
      .then(() => {
        BeastieLogger.info("BeastieBot is alive! RAWR");
        process.on("SIGINT", async () => {
          BeastieLogger.info(
            "Handling SIGINT, informing beastie to shut down politely"
          );
          let timeoutId = setTimeout(() => {
            BeastieLogger.warn(
              "Beastie took too long to shut down, killing process"
            );
            process.exit(4);
          }, 1000 * 5);
          try {
            await beastie.destroy();
          } catch (e) {
            BeastieLogger.error(
              `Beastie failed during shutdown  ${JSON.stringify(e)}`
            );
            process.exit(3);
          }
          clearTimeout(timeoutId);
        });
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
