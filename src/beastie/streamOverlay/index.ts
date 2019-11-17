import config from "../../config";

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

export default class StreamOverlayServer {
  app: any;
  server: any;
  io: any;

  constructor() {
    this.app = app;
    this.server = server;
    this.io = io;

    server.listen(config.STREAM_OVERLAY_SERVER_PORT);
    // WARNING: app.listen(80) will NOT work here

    io.on("connect", function(socket) {
      socket.emit("socket connection", { hello: "world" });

      socket.on("socket connection response", function(data) {
        console.log(data);
      });
    });
  }
}
