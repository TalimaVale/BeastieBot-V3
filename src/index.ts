require("dotenv").config();
import config from "./config";
const Koa = require("koa");
const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(config.PORT, err => {
  if (err) {
    console.error("Could not start listening on port", config.PORT, err);
  } else {
    console.log("Listening on port", config.PORT);
  }
});
