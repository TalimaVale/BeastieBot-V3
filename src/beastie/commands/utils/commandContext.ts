export default class CommandContext {
  platform: "twitch" | "discord";
  client: any;

  message: string;
  command: string;
  para1: string;
  para2: string;

  username: string;
  displayName: string;
  twitchId: string;
  roles: string[];

  constructor({
    platform = "twitch",
    client = {},
    message = "",
    command = "",
    para1 = "",
    para2 = "",
    username = "teammate",
    displayName = "Teammate",
    twitchId = "0",
    roles = []
  }: {
    platform: "twitch" | "discord";
    client: object;
    message: string;
    command: string;
    para1: string;
    para2: string;
    username: string;
    displayName: string;
    twitchId?: string;
    roles: string[];
  }) {
    this.platform = platform;
    this.client = client;
    this.message = message;
    this.command = command;
    this.para1 = para1;
    this.para2 = para2;
    this.username = username;
    this.displayName = displayName;
    this.twitchId = twitchId;
    this.roles = roles;
  }
}
