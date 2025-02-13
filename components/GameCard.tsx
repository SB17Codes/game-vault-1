"use client";

import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import GameActions from "./GameActions";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { user } = useUser();
  const [isFavoriteLocal, setIsFavoriteLocal] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleUnfavoriteOptimistic = async () => {
    setIsFavoriteLocal(false);
  };

  return (
    isFavoriteLocal && (
      <div className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link
          href={`/game/${game.id}`}
          prefetch={true} // Prefetch the game details page
          className="block"
          onClick={() => setIsLoading(true)} // Set loading state on click
        >
          <div className="relative">
            <img
              src={game.background_image || "/placeholder.svg"}
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{game.name}</h3>

            {game.genres && (
              <p className="text-gray-300 mb-2">
                <strong>Genres:</strong>{" "}
                {game.genres.map((genre) => genre.name).join(", ")}
              </p>
            )}

            <p>{game.released}</p>

            {game.platforms && (
              <p className="text-gray-300 mb-2">
                <strong>Platforms:</strong>{" "}
                {game.platforms
                  .map((platform) => platform.platform.name)
                  .join(", ")}
              </p>
            )}
          </div>
        </Link>
        <div className="p-4 flex items-center justify-between">
          <p className="text-yellow-400 flex items-center">
            <Star className="mr-1 h-4 w-4" /> {game.rating.toFixed(1)}
          </p>
          <GameActions
            gameId={game.id}
            userId={String(user?.id)}
            onUnfavorite={handleUnfavoriteOptimistic}
          />
        </div>
      </div>
    )
  );
}
