export type TwitchErrorResponse = {
  error: string;
  status: number;
  message: string;
};

export type TwitchProfile = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
};

export type TwitchUsersReturnData = {
  data: TwitchProfile[];
};

export type TwitchChatters = {
  broadcaster: string[];
  vips: string[];
  moderators: string[];
  staff: string[];
  admins: string[];
  global_mods: string[];
  viewers: string[];
};

export type TwitchChattersReturnData = {
  links: any;
  chatter_count: number;
  chatters: TwitchChatters;
};

export type TwitchStream = {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
};

export type TwitchStreamsReturnData = {
  data: TwitchStream[];
  pagination: any; // We don't currently use this but it's an iterator for the streams
};
