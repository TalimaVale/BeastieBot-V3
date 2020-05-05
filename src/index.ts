require("source-map-support").install();
require("dotenv").config();
import Beastie from "./beastie";

Beastie.create().then(beastie => {
  beastie.start().then(() => {
    console.log("BeastieBot is alive! RAWR");
  });
});
