// src/services/twitchService.ts
import { type TwitchClipsResponse, type TwitchUsersResponse, type TwitchClip } from '../types/twitch';

const CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET || '';

// Function to get an App Access Token
export const getAppAccessToken = async (): Promise<string | null> => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Twitch Client ID or Client Secret is missing.');
    return null;
  }

  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to get app access token:', errorData);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching app access token:', error);
    return null;
  }
};

// Function to get a channel's user ID from its display name
export const getChannelId = async (channelName: string, accessToken: string): Promise<string | null> => {
  if (!channelName || !accessToken) {
    console.error('Channel name or access token is missing.');
    return null;
  }

  try {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to get channel ID for ${channelName}:`, errorData);
      return null;
    }

    const data: TwitchUsersResponse = await response.json();
    if (data.data.length > 0) {
      return data.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching channel ID:', error);
    return null;
  }
};

// Function to get clips for a given channel ID
export const getClips = async (
  channelId: string,
  accessToken: string,
  clipType: string = 'Top',
  limit: number = 20,
  clipPeriod: string = '24h',
  clipLength: string = 'any'
): Promise<TwitchClip[]> => {
  if (!channelId || !accessToken) {
    console.error('Channel ID or access token is missing.');
    return [];
  }

  let url = `https://api.twitch.tv/helix/clips?broadcaster_id=${channelId}&first=100`;

  if (clipPeriod !== 'all') {
    const now = new Date();
    let startDate: Date | null = null;

    switch (clipPeriod) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      url += `&started_at=${startDate.toISOString()}`;
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch clips:', errorData);
      return [];
    }

    const data: TwitchClipsResponse = await response.json();
    let clips = data.data;

    // Filter by clip length
    if (clipLength !== 'any') {
      clips = clips.filter(clip => {
        const duration = clip.duration;
        if (clipLength === 'short') return duration <= 30;
        if (clipLength === 'medium') return duration > 30 && duration <= 60;
        if (clipLength === 'long') return duration > 60;
        return true;
      });
    }

    if (clipType === 'Random') {
      // Shuffle clips to simulate randomness
      for (let i = clips.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clips[i], clips[j]] = [clips[j], clips[i]];
      }
    }

    return clips.slice(0, limit);
  } catch (error) {
    console.error('Error fetching clips:', error);
    return [];
  }
};
