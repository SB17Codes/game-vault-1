"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { QUERIES } from "@/server/actions";
import GameCard from "./GameCard";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GameListProps {
  initialGames: any[];
  genres?: any[];
  platforms?: any[];
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function GameList({
  initialGames,
  genres,
  platforms,
}: GameListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [page, setPage] = useState(() => {
    const storedPage = localStorage.getItem("currentPage");
    return storedPage ? Number.parseInt(storedPage) : 1;
  });
  const [pageSize] = useState(20);

  // Debounce the filter values to reduce rapid re-fetches
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedYearFilter = useDebounce(yearFilter, 500);
  const debouncedGenreFilter = useDebounce(genreFilter, 500);
  const debouncedPlatformFilter = useDebounce(platformFilter, 500);

  // Construct dates parameter based on the debounced year filter
  const dates = debouncedYearFilter
    ? `${debouncedYearFilter}-01-01,${debouncedYearFilter}-12-31`
    : "";

  // Create a unique key based on all filter criteria
  const swrKey = useMemo(
    () => [
      "games",
      page,
      pageSize,
      debouncedSearchQuery,
      debouncedGenreFilter,
      debouncedPlatformFilter,
      dates,
    ],
    [
      page,
      pageSize,
      debouncedSearchQuery,
      debouncedGenreFilter,
      debouncedPlatformFilter,
      dates,
    ]
  );

  // The fetcher function uses your existing query call
  const fetchGames = async () => {
    const data = await QUERIES.GET_GAMES(
      page,
      pageSize,
      debouncedSearchQuery,
      debouncedPlatformFilter,
      debouncedGenreFilter,
      dates
    );
    return data;
  };

  const { data, error, isValidating } = useSWR(swrKey, fetchGames, {});

  // Update local storage whenever page changes
  useEffect(() => {
    localStorage.setItem("currentPage", page.toString());
  }, [page]);

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const getPaginationGroup = () => {
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
  };

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
        {isValidating ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin h-10 w-10 text-white" />
          </div>
        ) : data && data.results && data.results.length > 0 ? (
          data.results.map((game: any) => (
            <GameCard key={game.id} game={game} />
          ))
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
