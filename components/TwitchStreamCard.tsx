"use client"

import { useState } from "react"
import { Eye } from "lucide-react"

interface TwitchStreamCardProps {
  stream: {
    user_name: string
    game_name: string
    viewer_count: number
    thumbnail_url: string
    user_login: string
  }
}

export default function TwitchStreamCard({ stream }: TwitchStreamCardProps) {
  const { user_name, game_name, viewer_count, thumbnail_url, user_login } = stream
  const thumbnailUrl = thumbnail_url.replace("{width}x{height}", "320x180")
  const twitchStreamUrl = `https://www.twitch.tv/${user_login}`
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={twitchStreamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={`${user_name} streaming ${game_name}`}
          className="w-full h-40 object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Watch Stream</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{user_name}</h3>
        <p className="text-gray-400 text-sm mb-2 truncate">{game_name}</p>
        <div className="flex items-center text-red-500 text-sm">
          <Eye className="w-4 h-4 mr-1" />
          <span>{viewer_count.toLocaleString()} viewers</span>
        </div>
      </div>
    </a>
  )
}

