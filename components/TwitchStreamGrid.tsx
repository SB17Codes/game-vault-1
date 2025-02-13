import TwitchStreamCard from "./TwitchStreamCard";

interface Stream {
  id: string;
  [key: string]: any;
}

export default function TwitchStreamGrid({
  streams,
}: {
  streams: TwitchStream[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.length === 0 && <p>No streams found</p>}
      {streams.map((stream) => (
        <TwitchStreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
