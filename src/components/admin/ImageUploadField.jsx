import { useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function ImageUploadField({ label, hint, value, onChange, imgClassName = 'object-cover', alt }) {
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

  const controls = (capture) => (
    <input
      type="file"
      accept="image/*"
      {...(capture ? { capture: 'environment' } : {})}
      className="hidden"
      onChange={handleFile}
      disabled={busy}
    />
  );

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-start gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[3px] border border-dashed border-border bg-secondary/60">
          {value ? (
            <img src={value} alt={alt || label} className={`h-full w-full ${imgClassName}`} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground/60" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] border border-border bg-background px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:border-foreground/40">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {value ? 'Replace image' : 'From device'}
              {controls(false)}
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] border border-border bg-background px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:border-foreground/40">
              <Camera className="h-3.5 w-3.5" />
              Take photo
              {controls(true)}
            </label>
          </div>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="block text-[11.5px] text-muted-foreground underline underline-offset-2"
            >
              Remove
            </button>
          )}
          {hint && <p className="max-w-[240px] text-[11px] leading-relaxed text-muted-foreground">{hint}</p>}
          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
}