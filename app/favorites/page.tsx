import Link from "next/link";
import { Heart } from "lucide-react";
import { QUERIES } from "@/server/actions";
import GameCard from "@/components/GameCard";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Error from "./error";

async function getFavoriteGames(userId: string) {
  const favoriteGamesData = await QUERIES.GET_USER_FAVORITES(String(userId));

  const gameIds = favoriteGamesData.map((item) => item.game_id);
  const favoriteGames = await Promise.all(
    gameIds.map((gameId) => QUERIES.GET_GAME(gameId))
  );
  return favoriteGames;
}

export const metadata = {
  title: "Favorite Games",
  description: "A list of your favorite games",
};

export default async function Favorites() {
  const { userId } = await auth();

  if (!userId) {
    return <Error />;
  }

  const favoriteGames = await getFavoriteGames(String(userId));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Heart className="mr-2 text-red-500" /> Your Favorites
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
