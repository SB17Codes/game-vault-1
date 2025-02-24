import { Star } from "lucide-react";
import { QUERIES } from "@/server/actions";
import GameActions from "@/components/GameActions";
import GameDetailsTabs from "@/components/GameDetailsTabs";
import { getTwitchAccessToken } from "@/lib/twitch";
import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const gameId = Number(id);

  const game = await QUERIES.GET_GAME(gameId);

  return {
    title: game.name,
    description: game.description_raw,
    openGraph: {
      title: game.name,
      description: game.description_raw,
      images: [game.background_image],
    },
  };
}

export default async function GameDetails({ params }: Props) {
  const { id } = await params;
  const gameId = Number(id);
  const accessToken = await getTwitchAccessToken();
  const [game, gameScreenshots, redditPosts] = await Promise.all([
    QUERIES.GET_GAME(gameId),
    QUERIES.GET_GAME_SCREENSHOTS(gameId),
    QUERIES.GET_REDDIT_POSTS(gameId),
  ]);

  const twitchGameId = await QUERIES.SEARCH_TWITCH_GAMES(
    game.name,
    accessToken
  );
  let twitchStreams = [] as TwitchStream[];
  if (twitchGameId.length) {
    twitchStreams = await QUERIES.GET_TWITCH_STREAMS(
      twitchGameId[0].id,
      accessToken
    );
  }

  const { userId } = await auth();
  return (
    <Suspense fallback={<p>Loading data .... </p>}>
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
          <img
            src={game.background_image || "/placeholder.svg"}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-2" />
                <span className="text-2xl font-semibold text-white">
                  {game.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-gray-300">
                <strong>Release Date:</strong> {game.released}
              </p>
            </div>
          </div>
          {userId && (
            <div className="absolute top-4 right-4">
              <GameActions gameId={game.id} userId={userId!} />
            </div>
          )}
        </div>

        <GameDetailsTabs
          game={game}
          screenshots={gameScreenshots}
          streams={twitchStreams}
          redditPosts={redditPosts.results}
        />
      </div>
    </Suspense>
  );
}
