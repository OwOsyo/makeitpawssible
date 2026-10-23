import { Loader2 } from 'lucide-react';
import BedazzleCard from './BedazzleCard';

export default function CommunityWall({ posts, loading, currentUserId, onDelete }) {
  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center gap-2 py-10 text-[13px] text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Fetching the wall…
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="mt-8 rounded-[4px] border border-dashed border-border px-6 py-14 text-center">
        <p className="font-heading text-xl text-foreground">The wall is bare.</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Be the first to bedazzle a campus cat.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BedazzleCard
          key={post.id}
          post={post}
          canDelete={!!currentUserId && post.created_by_id === currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}