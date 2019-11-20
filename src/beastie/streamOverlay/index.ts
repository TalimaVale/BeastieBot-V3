import config from "../../config";
const server = require("http").Server();
const io = require("socket.io")(server);

export default class StreamOverlayServer {
  server: any;
  io: any;

  constructor() {
    this.server = server;
    this.io = io;

    server.listen(config.STREAM_OVERLAY_SERVER_PORT);

    io.on("connect", socket => {
      socket.emit("socket connection", { hello: "world" });

      socket.on("socket connection response", data => {
        console.log(data);
      });
    });
  }
}
