import { useState } from 'react';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PhotoSourcePicker({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } catch (err) {
      setError('Upload failed. Try a smaller image.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  const input = (capture) => (
    <input
      type="file"
      accept="image/*"
      {...(capture ? { capture: 'environment' } : {})}
      className="hidden"
      onChange={handleFile}
      disabled={busy}
    />
  );

  if (busy) {
    return (
      <div className="flex h-[84px] shrink-0 items-center justify-center rounded-[3px] border border-dashed border-border">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (value) {
    return (
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => onChange('')}
          className="block w-[64px] overflow-hidden rounded-[3px] border-2 border-foreground"
          title="Tap to remove your photo"
        >
          <img src={value} alt="Your photo" className="h-16 w-16 object-cover" />
          <span className="block max-w-[64px] truncate bg-background py-1 text-center text-[10.5px] text-muted-foreground">
            Your photo
          </span>
        </button>
        {error && <p className="mt-1 w-[64px] text-[10px] text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="shrink-0">
      <div className="flex gap-1">
        <label className="flex h-16 w-[46px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[3px] border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
          <ImagePlus className="h-4 w-4" strokeWidth={1.6} />
          <span className="text-[9px] leading-none">Device</span>
          {input(false)}
        </label>
        <label className="flex h-16 w-[46px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[3px] border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
          <Camera className="h-4 w-4" strokeWidth={1.6} />
          <span className="text-[9px] leading-none">Camera</span>
          {input(true)}
        </label>
      </div>
      <span className="mt-1 block max-w-[96px] truncate text-center text-[10.5px] text-muted-foreground">
        Your photo
      </span>
      {error && <p className="text-[10px] text-destructive">{error}</p>}
    </div>
  );
}