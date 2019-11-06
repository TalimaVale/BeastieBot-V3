require("source-map-support").install();
require("dotenv").config();
import Beastie from "./beastie";

const beastie = new Beastie();

beastie.start().then(() => {
  console.log("Beastie is alive! RAWR");
});
