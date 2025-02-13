"use client";

import { useState, useEffect } from "react";
import { Heart, BookmarkPlus } from "lucide-react";
import { MUTATIONS, QUERIES } from "@/server/actions";
import { useRouter, usePathname } from "next/navigation";

interface GameActionsProps {
  gameId: number;
  userId: string;
  onUnfavorite?: () => void; // Make onUnfavorite optional
}

export default function GameActions({
  gameId,
  userId,
  onUnfavorite,
}: GameActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
      } catch (error) {
        console.error("Failed to fetch initial state:", error);
      }
    };

    if (userId && gameId) {
      fetchInitialState();
    }
  }, [userId, gameId]);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        if (isFavoritesPage && onUnfavorite) {
          onUnfavorite(); // Conditionally call onUnfavorite only on Favorites page
        }
        await MUTATIONS.REMOVE_FAVORITE(userId, gameId);
        router.refresh();
      } else {
        await MUTATIONS.ADD_FAVORITE(userId, gameId);
        router.refresh();
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const handleWishlistClick = async () => {
    try {
      if (isWishlisted) {
        await MUTATIONS.REMOVE_WISHLIST(userId, gameId);
        router.refresh();
      } else {
        await MUTATIONS.ADD_WISHLIST(userId, gameId);
        router.refresh();
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleFavoriteClick}
        className={`p-2 rounded-full ${
          isFavorite ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <Heart
          className={`h-6 w-6 ${isFavorite ? "text-white" : "text-gray-300"}`}
        />
      </button>
      <button
        onClick={handleWishlistClick}
        className={`p-2 rounded-full ${
          isWishlisted ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <BookmarkPlus
          className={`h-6 w-6 ${isWishlisted ? "text-white" : "text-gray-300"}`}
        />
      </button>
    </div>
  );
}
