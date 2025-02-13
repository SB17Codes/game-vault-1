"use client"

import { useState, useEffect, useCallback } from "react"
import { QUERIES } from "@/server/actions"
import GameCard from "./GameCard"
import { Search } from "lucide-react"
import debounce from "debounce"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface GameListProps {
  initialGames: any[]
}

export default function GameList({ initialGames }: GameListProps) {
  const [featuredGames, setFeaturedGames] = useState(initialGames)
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [genreFilter, setGenreFilter] = useState("")
  const [platformFilter, setPlatformFilter] = useState("")

  const debouncedFetchGames = useCallback(
    debounce(async (search: string, dates: string, genres: string, platforms: string) => {
      const data = await QUERIES.GET_GAMES(1, 20, search, false, false, platforms, genres, dates)
      setFeaturedGames(data.results)
    }, 500),
    [],
  )

  useEffect(() => {
    const dates = yearFilter ? `${yearFilter}-01-01,${yearFilter}-12-31` : ""
    debouncedFetchGames(searchQuery, dates, genreFilter, platformFilter)

    return () => {
      debouncedFetchGames.clear()
    }
  }, [searchQuery, yearFilter, genreFilter, platformFilter, debouncedFetchGames])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Game Library</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for games..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="indie">Indie</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="pc">PC</SelectItem>
                <SelectItem value="playstation">PlayStation</SelectItem>
                <SelectItem value="xbox">Xbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

