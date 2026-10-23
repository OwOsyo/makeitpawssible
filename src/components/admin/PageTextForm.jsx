import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PAGE_TEXT, PAGE_TEXT_GROUPS } from '@/lib/pageText';

export default function PageTextForm({ settings, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState(PAGE_TEXT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = {};
    Object.keys(PAGE_TEXT).forEach((key) => {
      if (settings?.[key]) stored[key] = settings[key];
    });
    setForm({ ...PAGE_TEXT, ...stored });
  }, [settings]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      if (settings?.id) await base44.entities.SiteSetting.update(settings.id, form);
      else await base44.entities.SiteSetting.create(form);
      await onSaved();
      toast({ title: 'Page text saved', description: 'The landing page copy is up to date.' });
    } catch (error) {
      toast({ title: 'Could not save', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-[4px] border border-border bg-card p-5">
        <h2 className="font-heading text-xl text-foreground">Every word on the landing page</h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
          Edit any line below and save — the landing page shows your words immediately.
        </p>
      </div>

      {PAGE_TEXT_GROUPS.map((group) => (
        <div key={group.title} className="rounded-[4px] border border-border bg-card p-5">
          <h3 className="font-heading text-[17px] text-foreground">{group.title}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className={field.multiline ? 'sm:col-span-2' : ''}>
                <Label htmlFor={`page-${field.key}`}>{field.label}</Label>
                {field.multiline ? (
                  <Textarea
                    id={`page-${field.key}`}
                    rows={3}
                    value={form[field.key]}
                    onChange={(e) => set(field.key, e.target.value)}
                    className="mt-1.5"
                  />
                ) : (
                  <Input
                    id={`page-${field.key}`}
                    value={form[field.key]}
                    onChange={(e) => set(field.key, e.target.value)}
                    className="mt-1.5"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-[3px] bg-foreground px-5 py-3 text-[13px] font-medium text-background disabled:opacity-50"
      >
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save page text
      </button>
    </form>
  );
}