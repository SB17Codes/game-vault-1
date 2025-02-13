import RedditPost from "./RedditPost";

interface RedditPostGridProps {
  posts: RedditPost[];
}
export default function RedditPostGrid({ posts }: RedditPostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length === 0 && <p>No posts found</p>}

      {posts.map((post) => (
        <RedditPost key={post.id} post={post} />
      ))}
    </div>
  );
}
