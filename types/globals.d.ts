type Game = {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  reviews_text_count: string;
  added: number;
  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  esrb_rating: {
    id: number;
    slug: string;
    name: string;
  } | null;
  platforms: {
    platform: {
      id: number;
      name: string;
      slug: string;
    };
    released_at: string | null;
    requirements: {
      minimum: string;
      recommended: string;
    } | null;
  }[];
  genres: { id: number; name: string; slug: string }[];
  stores: { id: number; url: string }[];
  clip: { clip: string; video: string } | null;
  screenshots: { id: number; image: string }[];
  short_screenshots: { id: number; image: string }[];
  description_raw: string;
};

type RedditPost = {
  id: number;
  name: string;
  text: string;
  image: string;
  url: string;
  username: string;
  username_url: string;
  created: string;
};


 type TwitchStream = {
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
};