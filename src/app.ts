require("source-map-support").install();
import Koa = require("koa");
import routes from "./endpoints/routes";

const app = new Koa();
const bodyParser = require("koa-bodyparser");

app.use(bodyParser());

app.use(routes.routes());

export default app;
