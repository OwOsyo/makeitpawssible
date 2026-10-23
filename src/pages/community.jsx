import { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'@/components/ui/alert-dialog';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import SiteHeader from '@/components/site/SiteHeader';
import CommunityWall from '@/components/studio/CommunityWall';
import PhotoSourcePicker from '@/components/studio/PhotoSourcePicker';

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [customImage, setCustomImage] = useState('');
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      const page = await base44.entities.Bedazzle.list({ sort: '-created_date', limit: 24 });
      setPosts(page.items ?? []);
      setLoadingPosts(false);
    })();
  }, []);

  async function post() {
    if (!customImage || !caption.trim()) return;
    setPosting(true);
    try {
      await base44.entities.Bedazzle.create({
        cat_id: '',
        cat_name: 'My photo',
        image_url: customImage,
        caption: caption.trim(),
        author_name: user?.email || 'A guardian',
        author_role: user?.role === 'admin' ? 'admin' : 'user',
        gems: []
      });
      const page = await base44.entities.Bedazzle.list({ sort: '-created_date', limit: 24 });
      setPosts(page.items ?? []);
      setCustomImage('');
      setCaption('');
      toast({ title: 'Posted to the wall' });
    } catch (error) {
      toast({ title: 'Could not post', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await base44.entities.Bedazzle.delete(deleteTarget.id);
      const page = await base44.entities.Bedazzle.list({ sort: '-created_date', limit: 24 });
      setPosts(page.items ?? []);
      setDeleteTarget(null);
      toast({ title: 'Post removed' });
    } catch (error) {
      toast({ title: 'Could not delete the post', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-border" />
          Community wall
        </p>
        <h1 className="mt-4 max-w-xl font-heading text-[clamp(2rem,4vw,2.9rem)] text-foreground">The Community Wall.

        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">Upload pictures of cats here! Your work in bedazzle studio can also be upliadeduploaded.Reminder, only

        </p>

        <section className="mt-9">
          <div className="rounded-[4px] border border-border bg-card p-4 sm:p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Share a photo of a campus cat</p>
            <div className="mt-3 flex items-start gap-3">
              <PhotoSourcePicker value={customImage} onChange={setCustomImage} />
              <div className="min-w-0 flex-1">
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={90}
                  placeholder="Add a few words about this cat…"
                  className="w-full rounded-[3px] border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
                
                <button
                  type="button"
                  onClick={post}
                  disabled={posting || !customImage || !caption.trim()}
                  className="mt-2 inline-flex items-center gap-2 rounded-[3px] bg-accent px-4 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
                  
                  {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Post to the wall
                </button>
                <p className="mt-1.5 text-[11px] text-muted-foreground">A photo and a few words are all it takes.</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
          <CommunityWall
              posts={posts}
              loading={loadingPosts}
              currentUserId={user?.id}
              onDelete={setDeleteTarget} />
            
          </div>
        </section>
      </main>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the artwork from the community wall permanently. You can only delete posts you made yourself.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleting}>
              
              Delete post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);

}