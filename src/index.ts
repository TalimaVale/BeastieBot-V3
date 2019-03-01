require("dotenv").config();
import app from "./app";
import config from "./config";

// @ts-ignore
app.listen(config.PORT, err => {
  if (err) {
    console.error("Could not start listening on port", config.PORT, err);
  } else {
    console.log("Listening on port", config.PORT);
  }
});
