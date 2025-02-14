import { ArrowUpCircle, MessageCircle, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RedditPostProps {
  post: RedditPost;
}

export default function RedditPost({ post }: RedditPostProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.name}</h3>
      <p className="text-gray-400 text-sm mb-2">
        Posted by u/{post.username} •{" "}
        {formatDistanceToNow(new Date(post.created))} ago
      </p>
      <p className="text-gray-300 mb-4 line-clamp-3">{post.text}</p>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-white transition-colors duration-200"
        >
          <ExternalLink className="mr-1 h-4 w-4" />
          <span>View on Reddit</span>
        </a>
      </div>
    </div>
  );
}
