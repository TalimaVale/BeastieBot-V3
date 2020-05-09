export default class CommandContext {
  platform: string;
  client: any;

  message: string;
  command: string;
  para1: string;
  para2: string;

  username: string;
  displayName: string;

  constructor({
    platform = "twitch",
    client = {},
    message = "",
    command = "",
    para1 = "",
    para2 = "",
    username = "teammate",
    displayName = "Teammate"
  }) {
    this.platform = platform;
    this.client = client;
    this.message = message;
    this.command = command;
    this.para1 = para1;
    this.para2 = para2;
    this.username = username;
    this.displayName = displayName;
  }
}
