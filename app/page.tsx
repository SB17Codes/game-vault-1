import Link from "next/link";
import { Search } from "lucide-react";
import { QUERIES } from "@/server/actions";
import GameList from "@/components/GameList";

async function getGenres() {
  const genresData = await QUERIES.GET_GENRES();
  return genresData.results;
}

async function getPlatforms() {
  const platformsData = await QUERIES.GET_PLATFORMS();
  return platformsData.results;
}

export default async function Home() {
  const featuredGamesData = await QUERIES.GET_GAMES();
  const genres = await getGenres();
  const platforms = await getPlatforms();

  return (
    <div className="container mx-auto px-4">
      <GameList
        initialGames={featuredGamesData.results}
        genres={genres}
        platforms={platforms}
      />
    </div>
  );
}
