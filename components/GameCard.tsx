"use client";

import Link from "next/link";
import {
  Loader2,
  Star,
  Calendar,
  Gamepad2,
  Monitor,
  Smartphone,
  Globe,
} from "lucide-react";
import GameActions from "./GameActions";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import type React from "react";

interface GameCardProps {
  game: Game;
}

const platformIcons: { [key: string]: React.ElementType } = {
  pc: Monitor,
  playstation: Gamepad2,
  xbox: Gamepad2,
  nintendo: Gamepad2,
  ios: Smartphone,
  android: Smartphone,
  linux: Globe,
  mac: Globe,
  web: Globe,
};

export default function GameCard({ game }: GameCardProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const getPlatformIcon = (platformName: string) => {
    const lowerCaseName = platformName.toLowerCase();
    for (const [key, Icon] of Object.entries(platformIcons)) {
      if (lowerCaseName.includes(key)) {
        return <Icon className="w-4 h-4" />;
      }
    }
    return <Gamepad2 className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <Link
        href={`/game/${game.id}`}
        prefetch={true}
        className="block"
        onClick={() => setIsLoading(true)}
      >
        <div className="relative">
          <img
            src={game.background_image || "/placeholder.svg"}
            alt={game.name}
            className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-yellow-500 rounded-full px-2 py-1">
                <Star className="w-4 h-4 text-gray-900" />
                <span className="ml-1 text-xs font-bold text-gray-900">
                  {game.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex space-x-1">
                {game.platforms &&
                  game.platforms.slice(0, 3).map((platform, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-full p-1"
                      title={platform.platform.name}
                    >
                      {getPlatformIcon(platform.platform.name)}
                    </div>
                  ))}
                {game.platforms && game.platforms.length > 3 && (
                  <div
                    className="bg-gray-800 rounded-full p-1 text-xs text-white font-bold flex items-center justify-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    +{game.platforms.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 truncate">
            {game.name}
          </h3>
          <div className="flex items-center text-sm text-gray-400 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(game.released).getFullYear()}</span>
          </div>
          {game.genres && (
            <p className="text-sm text-gray-400 truncate">
              {game.genres.map((genre) => genre.name).join(", ")}
            </p>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4 flex justify-end items-center">
        {user?.id && <GameActions gameId={game.id} userId={String(user?.id)} />}
      </div>
    </div>
  );
}
