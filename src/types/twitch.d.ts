// src/types/twitch.d.ts
export interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string; // ISO 8601
  thumbnail_url: string;
  duration: number; // in seconds
}

export interface TwitchPagination {
  cursor?: string;
}

export interface TwitchClipsResponse {
  data: TwitchClip[];
  pagination: TwitchPagination;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

export interface TwitchUsersResponse {
  data: TwitchUser[];
}
