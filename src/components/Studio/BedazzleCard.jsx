import { formatDistanceToNow } from 'date-fns';
import { Megaphone, Sparkles, Trash2 } from 'lucide-react';
import BedazzleArt from './BedazzleArt';

export default function BedazzleCard({ post, canDelete, onDelete }) {
  return (
    <figure className="overflow-hidden rounded-[4px] border border-border bg-card">
      <BedazzleArt
        imageUrl={post.image_url}
        gems={post.gems || []}
        alt={`${post.cat_name || 'Community cat'}, bedazzled by a volunteer`}
        className="aspect-[4/5] w-full"
      />
      <figcaption className="space-y-1.5 px-4 py-3">
        {post.author_role === 'admin' && (
          <span className="inline-flex w-fit items-center gap-1 rounded-[3px] bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-accent">
            <Megaphone className="h-3 w-3" strokeWidth={1.8} />
            Announcement
          </span>
        )}
        {post.caption && <p className="font-heading text-[16px] leading-snug text-foreground">{post.caption}</p>}
        <p className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span className="truncate">
            {post.author_name || 'A guardian'}
            {post.author_role === 'admin' && (
              <span className="ml-1.5 inline-flex items-center rounded-[3px] bg-foreground/10 px-1 py-0.5 align-middle text-[9px] font-medium uppercase tracking-wide text-foreground">
                Admin
              </span>
            )}
            {' · '}
            {post.cat_name}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.8} />
            {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : 'just now'}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete?.(post)}
                aria-label="Delete my post"
                title="Delete my post"
                className="ml-1 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            )}
          </span>
        </p>
      </figcaption>
    </figure>
  );
}