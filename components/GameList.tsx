"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERIES } from "@/server/actions";
import GameCard from "./GameCard";
import { Search, Loader2 } from "lucide-react";
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

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
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
  const DEFAULT_FILTER_VALUES = {
    year: "all",
    genre: "all",
    platform: "all",
  };

  // Update state initialization
  const [yearFilter, setYearFilter] = useState(DEFAULT_FILTER_VALUES.year);
  const [genreFilter, setGenreFilter] = useState(DEFAULT_FILTER_VALUES.genre);
  const [platformFilter, setPlatformFilter] = useState(
    DEFAULT_FILTER_VALUES.platform
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  // Update yearOptions
  const yearOptions = [
    { value: "all", label: "All Years" },
    ...years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    })),
  ];
  const [pageSize] = useState(20);

  // Debounce the filter values to reduce rapid re-fetches
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedYearFilter = useDebounce(yearFilter, 500);
  const debouncedGenreFilter = useDebounce(genreFilter, 500);
  const debouncedPlatformFilter = useDebounce(platformFilter, 500);

  // Construct dates parameter from the debounced year filter
  const dates = debouncedYearFilter
    ? `${debouncedYearFilter}-01-01,${debouncedYearFilter}-12-31`
    : "";

  const queryKey = [
    "games",
    debouncedSearchQuery,
    debouncedGenreFilter,
    debouncedPlatformFilter,
    dates,
  ];

  const fetchGames = async ({ pageParam = 1 }) => {
    // Only include filters if they're not set to "all"
    const searchParams = debouncedSearchQuery.trim();
    const platformParams =
      debouncedPlatformFilter === "all" ? "" : debouncedPlatformFilter;
    const genreParams =
      debouncedGenreFilter === "all" ? "" : debouncedGenreFilter;
    const dateParams =
      debouncedYearFilter === "all"
        ? ""
        : `${debouncedYearFilter}-01-01,${debouncedYearFilter}-12-31`;

    const data = await QUERIES.GET_GAMES(
      pageParam,
      pageSize,
      searchParams,
      platformParams,
      genreParams,
      dateParams
    );

    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: data.results,
      currentPage: pageParam,
    };
  };
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetchGames,

    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      const totalPages = Math.ceil(lastPage.count / pageSize);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialData: {
      pages: [
        {
          count: initialGames.length,
          next: null,
          previous: null,
          results: initialGames,
          currentPage: 1,
        },
      ],
      pageParams: [1],
    },
    initialPageParam: 1,
  });

  // Optionally, refetch when any filter changes
  useEffect(() => {
    refetch();
  }, [
    debouncedSearchQuery,
    debouncedGenreFilter,
    debouncedPlatformFilter,
    dates,
    refetch,
  ]);

  // Flatten pages to a single list of games
  const games = data ? data.pages.flatMap((page) => page.results) : [];

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
              {yearOptions.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres?.map((genre) => (
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
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms?.map((platform) => (
                <SelectItem key={platform.id} value={platform.id.toString()}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{" "}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin h-10 w-10 text-white" />
          </div>
        ) : games.length > 0 ? (
          games.map((game: any) => <GameCard key={game.id} game={game} />)
        ) : (
          <p>No games found</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4">
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
}
