import { useEffect, useState } from 'react';
import { Loader2, Send, Trash2, Undo2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import SiteHeader from '@/components/site/SiteHeader';
import BedazzleCanvas from '@/components/studio/BedazzleCanvas';
import GemPalette from '@/components/studio/GemPalette';
import PhotoSourcePicker from '@/components/studio/PhotoSourcePicker';
import { GEM_COLORS, GEM_SIZES } from '@/lib/gems';

export default function Studio() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [cats, setCats] = useState([]);
  const [catId, setCatId] = useState(null);
  const [customImage, setCustomImage] = useState('');
  const [gems, setGems] = useState([]);
  const [tool, setTool] = useState({
    mode: 'shape',
    glyph: '✦',
    penWidth: 4,
    color: GEM_COLORS[0].value,
    size: GEM_SIZES[1].value,
    text: '',
    font: 'serif',
  });
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await base44.entities.Cat.filter({ active: true });
      setCats(list);
      if (list[0]) setCatId(list[0].id);
    })();
  }, []);

  const cat = cats.find((c) => c.id === catId);

  function commitStroke(points) {
    setGems((prev) => [
      ...prev,
      {
        kind: 'pen',
        points: points.map(([x, y]) => ({ x, y })),
        color: tool.color,
        size: tool.penWidth,
        rotation: 0,
      },
    ]);
  }

  function placeDecoration(x, y) {
    if (tool.mode === 'text' && !tool.text.trim()) return;
    setGems((prev) => [
      ...prev,
      {
        kind: tool.mode,
        x,
        y,
        glyph: tool.glyph,
        shape: tool.mode === 'diamond' ? tool.stickerShape : 'diamond',
        color: tool.color,
        size: tool.size,
        text: tool.mode === 'text' ? tool.text.trim() : '',
        font: tool.font,
        rotation: tool.mode === 'shape' ? Math.round(Math.random() * 40 - 20) : 0,
      },
    ]);
  }

  async function post() {
    if ((!cat && !customImage) || gems.length === 0) return;
    setPosting(true);
    try {
      await base44.entities.Bedazzle.create({
        cat_id: cat?.id || '',
        cat_name: cat?.name || 'My photo',
        image_url: customImage || cat.photo_url,
        caption: caption.trim(),
        author_name: user?.email || 'A guardian',
        author_role: user?.role === 'admin' ? 'admin' : 'user',
        gems,
      });
      setGems([]);
      setCaption('');
      toast({ title: 'Posted to the wall', description: `${cat?.name || 'Your photo'} has never looked shinier. See it on the community wall.` });
    } catch (error) {
      toast({ title: 'Could not post', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-border" />
          Bedazzle studio
        </p>
        <h1 className="mt-4 max-w-xl font-heading text-[clamp(2rem,4vw,2.9rem)] text-foreground">
          Give a campus cat the sparkle it deserves.
        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          Pick a cat, tap the photo to place colour gems, draw with the pen or add your own words, then post your masterpiece to the community wall.
        </p>

        <div className="mt-9 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[4px] border border-border bg-card p-4 sm:p-5">
              {cat || customImage ? (
                <BedazzleCanvas
                  cat={cat || { id: null, name: 'My photo', photo_url: customImage }}
                  gems={gems}
                  isPen={tool.mode === 'pen'}
                  penColor={tool.color}
                  penWidth={tool.penWidth}
                  onPlace={placeDecoration}
                  onDrawEnd={commitStroke}
                  hint={
                    tool.mode === 'text'
                      ? tool.text.trim()
                        ? 'Tap the photo to place your words'
                        : 'Type your words in the panel first'
                      : tool.mode === 'pen'
                        ? 'Press and drag on the photo to draw'
                        : 'Tap the photo to place a colour gem'
                  }
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-[13px] text-muted-foreground">
                  Loading the colony…
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[4px] border border-border bg-card p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Choose a photo</p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                <PhotoSourcePicker
                  value={customImage}
                  onChange={(url) => {
                    setCustomImage(url);
                    if (url) setCatId(null);
                  }}
                />
                {cats.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCatId(c.id);
                      setCustomImage('');
                    }}
                    className={`shrink-0 overflow-hidden rounded-[3px] border-2 transition-colors ${
                      c.id === catId ? 'border-foreground' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={c.photo_url} alt={c.name} className="h-16 w-16 object-cover" />
                    <span className="block max-w-[64px] truncate bg-background py-1 text-center text-[10.5px] text-muted-foreground">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 border-t border-border pt-5">
                <GemPalette
                  mode={tool.mode}
                  glyph={tool.glyph}
                  penWidth={tool.penWidth}
                  color={tool.color}
                  size={tool.size}
                  text={tool.text}
                  font={tool.font}
                  onChange={(patch) => setTool((prev) => ({ ...prev, ...patch }))}
                />
              </div>

              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setGems((prev) => prev.slice(0, -1))}
                  disabled={!gems.length}
                  className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-foreground transition-colors hover:border-foreground/40 disabled:opacity-40"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => setGems([])}
                  disabled={!gems.length}
                  className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-foreground transition-colors hover:border-foreground/40 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>

              <div className="mt-4">
                <label htmlFor="caption" className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Caption (optional)
                </label>
                <input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={90}
                  placeholder="Disco Biscuit, 1978"
                  className="mt-1.5 w-full rounded-[3px] border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={post}
                disabled={posting || (!cat && !customImage) || gems.length === 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[3px] bg-accent px-4 py-3 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Post to the community wall
              </button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Add at least one gem, pen stroke or word to post.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}