"use client";

import { useState, useEffect } from "react";
import { Heart, BookmarkPlus } from "lucide-react";
import { MUTATIONS, QUERIES } from "@/server/actions";
import { useRouter, usePathname } from "next/navigation";

interface GameActionsProps {
  gameId: number;
  userId: string;
}

export default function GameActions({ gameId, userId }: GameActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isFavoritesPage = pathname === "/favorites";

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const favorites = await QUERIES.GET_USER_FAVORITES(userId);
        setIsFavorite(favorites.some((fav) => fav.game_id === gameId));

        const wishlist = await QUERIES.GET_USER_WISHLIST(userId);
        setIsWishlisted(wishlist.some((item) => item.game_id === gameId));
      } catch (err: any) {
        console.error("Failed to fetch initial state:", err);
        setError("Failed to load favorite/wishlist status.");
      }
    };

    if (userId && gameId) {
      fetchInitialState();
    }
  }, [userId, gameId]);

  const handleFavoriteClick = async () => {
    try {
      setIsFavorite((prev) => !prev); // Optimistic update
      if (isFavorite) {
        await MUTATIONS.REMOVE_FAVORITE(userId, gameId);
      } else {
        await MUTATIONS.ADD_FAVORITE(userId, gameId);
      }
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update favorite:", err);
      setError("Failed to update favorite status.");
      setIsFavorite((prev) => !prev); // Revert on error
    }
  };

  const handleWishlistClick = async () => {
    try {
      setIsWishlisted((prev) => !prev); // Optimistic update
      if (isWishlisted) {
        await MUTATIONS.REMOVE_WISHLIST(userId, gameId);
      } else {
        await MUTATIONS.ADD_WISHLIST(userId, gameId);
      }
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update wishlist:", err);
      setError("Failed to update wishlist status.");
      setIsWishlisted((prev) => !prev); // Revert on error
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
      <div className="flex space-x-2">
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isFavorite
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className="h-5 w-5" />
        </button>
        <button
          onClick={handleWishlistClick}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isWishlisted
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <BookmarkPlus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
