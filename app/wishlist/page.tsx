import { QUERIES } from "@/server/actions";
import GameCard from "@/components/GameCard";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Error from "./error";

async function getWishlistGames(userId: string) {
  const favoriteGamesData = await QUERIES.GET_USER_WISHLIST(String(userId));

  const gameIds = favoriteGamesData.map((item) => item.game_id);
  const wishlistGames = await Promise.all(
    gameIds.map((gameId) => QUERIES.GET_GAME(gameId))
  );
  return wishlistGames;
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

  const wishlistGames = await getWishlistGames(String(userId));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        Your Wishlist
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
