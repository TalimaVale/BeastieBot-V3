export default class CommandContext {
  platform: "twitch" | "discord";
  client: any;
  whisper: boolean;
  meta: any | null;

  message: string;
  command: string;
  para1: string;
  para2: string;
  parameters: string[];

  username: string;
  displayName: string;
  twitchId: string;
  roles: string[];

  constructor({
    platform = "twitch",
    whisper = false,
    meta = null,
    client = {},
    message = "",
    command = "",
    para1 = "",
    para2 = "",
    parameters = [],
    username = "teammate",
    displayName = "Teammate",
    twitchId = "0",
    roles = []
  }: {
    platform: "twitch" | "discord";
    whisper?: boolean;
    meta?: any | null;
    client: object;
    message: string;
    command: string;
    para1: string;
    para2: string;
    parameters: string[];
    username: string;
    displayName: string;
    twitchId?: string;
    roles: string[];
  }) {
    this.platform = platform;
    this.whisper = whisper;
    this.meta = meta;
    this.client = client;
    this.message = message;
    this.command = command;
    this.para1 = para1;
    this.para2 = para2;
    this.parameters = parameters;
    this.username = username;
    this.displayName = displayName;
    this.twitchId = twitchId;
    this.roles = roles;
  }
}
