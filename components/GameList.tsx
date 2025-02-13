"use client";

import { useState, useEffect, useCallback } from "react";
import { QUERIES } from "@/server/actions";
import GameCard from "./GameCard";
import { Search, Loader2 } from "lucide-react";
import debounce from "debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GameListProps {
  initialGames: any[];
  genres?: any[];
  platforms?: any[];
}

export default function GameList({
  initialGames,
  genres,
  platforms,
}: GameListProps) {
  const [featuredGames, setFeaturedGames] = useState<Game[]>(initialGames);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [page, setPage] = useState(() => {
    const storedPage = localStorage.getItem("currentPage");
    return storedPage ? Number.parseInt(storedPage) : 1;
  });
  const [pageSize] = useState(20);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const debouncedFetchGames = useCallback(
    debounce(
      async (
        search: string,
        dates: string,
        genres: string,
        platforms: string,
        page: number,
        pageSize: number
      ) => {
        setIsLoading(true); // Set loading state to true before fetching
        try {
          const data = await QUERIES.GET_GAMES(
            page,
            pageSize,
            search,
            platforms,
            genres,
            dates
          );
          setFeaturedGames(data.results);
          setCount(data.count);
        } finally {
          setIsLoading(false); // Set loading state to false after fetching (success or error)
        }
      },
      500
    ),
    []
  );

  useEffect(() => {
    const dates = yearFilter ? `${yearFilter}-01-01,${yearFilter}-12-31` : "";
    debouncedFetchGames(
      searchQuery,
      dates,
      genreFilter,
      platformFilter,
      page,
      pageSize
    );

    return () => {
      debouncedFetchGames.clear();
    };
  }, [
    searchQuery,
    yearFilter,
    genreFilter,
    platformFilter,
    page,
    pageSize,
    debouncedFetchGames,
  ]);

  useEffect(() => {
    localStorage.setItem("currentPage", page.toString());
  }, [page]);

  const totalPages = Math.ceil(count / pageSize);

  const getPaginationGroup = useCallback(() => {
    const visiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [page, totalPages]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Game Library</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
        <div className="flex flex-wrap gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Years</SelectItem>
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
              <SelectItem value="0">All Genres</SelectItem>
              {genres &&
                genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.slug}>
                    {genre.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Platforms</SelectItem>
              {platforms &&
                platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id.toString()}>
                    {platform.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin h-10 w-10 text-white" />
          </div>
        ) : featuredGames && featuredGames.length > 0 ? (
          featuredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p>No games found</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-2">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {getPaginationGroup().map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            variant={page === pageNumber ? "default" : "outline"}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
