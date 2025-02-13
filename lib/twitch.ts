const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
}

export async function getTwitchAccessToken(): Promise<string> {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get Twitch access token");
  }

  const data: TwitchTokenResponse = await response.json();
  return data.access_token;
}
