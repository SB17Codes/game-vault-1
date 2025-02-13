"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import TwitchStreamGrid from "@/components/TwitchStreamGrid";
import RedditPostGrid from "@/components/RedditPostGrid";

interface GameDetailsTabsProps {
  game: Game;
  screenshots: string[];
  streams: TwitchStream[];
  redditPosts: RedditPost[];
}

export default function GameDetailsTabs({
  game,
  screenshots,
  streams,
  redditPosts,
}: GameDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
        <TabsTrigger value="streams">Twitch Streams</TabsTrigger>
        <TabsTrigger value="reddit">Reddit Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="space-y-4">
        <p className="text-gray-300">{game.description_raw}</p>
        <div>
          <h3 className="text-xl font-semibold mb-2">Genres</h3>
          <p>{game.genres.map((genre) => genre.name).join(", ")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Platforms</h3>
          <p>
            {game.platforms
              .map((platform) => platform.platform.name)
              .join(", ")}
          </p>
        </div>
      </TabsContent>
      <TabsContent value="screenshots">
        <ScreenshotGallery screenshots={screenshots} />
      </TabsContent>
      <TabsContent value="streams">
        <TwitchStreamGrid streams={streams} />
      </TabsContent>
      <TabsContent value="reddit">
        <RedditPostGrid posts={redditPosts} />
      </TabsContent>
    </Tabs>
  );
}
