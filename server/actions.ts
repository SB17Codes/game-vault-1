"server only";

import { supabase } from "./db/supabaseClient";
import { cache } from "react";

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_BASE_URL = "https://api.twitch.tv/helix";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface Platform {
  id: number;
  name: string;
  slug: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  tags: string[];
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

interface TwitchGame {
  id: string;
  name: string;
  box_art_url: string;
}

export const QUERIES = {
  GET_USER_FAVORITES: async (userId: string) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  },

  GET_USER_WISHLIST: async (userId: string) => {
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
    return data;
  },

  GET_GAMES: async (
    page: number = 1,
    pageSize: number = 20,
    search: string = "",
    platforms: string = "",
    genres: string = "",
    dates: string = "" // Use dates for year filtering
  ): Promise<PaginatedResponse<Game>> => {
    let url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page_size=${pageSize}&page=${page}`;

    if (search) url += `&search=${search}`;
    if (platforms) url += `&platforms=${platforms}`;
    if (genres) url += `&genres=${genres}`;
    if (dates) url += `&dates=${dates}`; // Use dates for year filtering

    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  GET_GAME: async (id: number): Promise<Game> => {
    const response = await fetch(
      `${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`
    );
    const data = await response.json();
    return data;
  },

  GET_GAME_SCREENSHOTS: async (id: number): Promise<string[]> => {
    const response = await fetch(
      `${RAWG_BASE_URL}/games/${id}/screenshots?key=${RAWG_API_KEY}`
    );
    const { results } = await response.json();
    return results.map((screenshot: any) => screenshot.image);
  },

  GET_REDDIT_POSTS: async (id: number) => {
    const response = await fetch(
      `${RAWG_BASE_URL}/games/${id}/reddit?key=${RAWG_API_KEY}`
    );
    const data = await response.json();
    return data;
  },

  GET_GENRES: cache(async (): Promise<PaginatedResponse<Genre>> => {
    const response = await fetch(`${RAWG_BASE_URL}/genres?key=${RAWG_API_KEY}`);
    const data = await response.json();
    return data;
  }),

  GET_PLATFORMS: cache(async (): Promise<PaginatedResponse<Platform>> => {
    const response = await fetch(
      `${RAWG_BASE_URL}/platforms?key=${RAWG_API_KEY}`
    );
    const data = await response.json();
    return data;
  }),

  SEARCH_TWITCH_GAMES: async (
    gameName: string,
    accessToken: string
  ): Promise<TwitchGame[]> => {
    const response = await fetch(
      `${TWITCH_BASE_URL}/games?name=${encodeURIComponent(gameName)}`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID || "",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Twitch API error:", response.status, response.statusText);
      throw new Error(
        `Twitch API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data;
  },

  GET_TWITCH_STREAMS: async (
    gameId: string,
    accessToken: string
  ): Promise<TwitchStream[]> => {
    const response = await fetch(
      `${TWITCH_BASE_URL}/streams?game_id=${gameId}`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID || "",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Twitch API error:", response.status, response.statusText);
      throw new Error(
        `Twitch API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data;
  },
};

export const MUTATIONS = {
  ADD_FAVORITE: async (userId: string, gameId: number) => {
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, game_id: gameId });

    if (error) {
      throw error;
    }
    return data;
  },

  ADD_WISHLIST: async (userId: string, gameId: number) => {
    const { data, error } = await supabase
      .from("wishlist")
      .insert({ user_id: userId, game_id: gameId });

    if (error) {
      throw error;
    }
    return data;
  },

  REMOVE_FAVORITE: async (userId: string, gameId: number) => {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("game_id", gameId);

    if (error) {
      throw error;
    }
    return data;
  },

  REMOVE_WISHLIST: async (userId: string, gameId: number) => {
    const { data, error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("game_id", gameId);

    if (error) {
      throw error;
    }
    return data;
  },
};
