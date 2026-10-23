import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { HEALTH_STATUSES } from '@/lib/health';
import ImageUploadField from './ImageUploadField';

const BLANK = {
  name: '',
  photo_url: '',
  age_label: '',
  sex: 'Female',
  location: '',
  health_status: 'healthy',
  health_summary: '',
  last_checkup: '',
  vaccinated: false,
  sterilized: false,
  weight_kg: '',
  personality: '',
  ready_for_adoption: false,
  featured: false,
  active: true,
  needsText: '',
};

function toForm(cat) {
  if (!cat) return { ...BLANK };
  return {
    name: cat.name || '',
    photo_url: cat.photo_url || '',
    age_label: cat.age_label || '',
    sex: cat.sex || 'Female',
    location: cat.location || '',
    health_status: cat.health_status || 'healthy',
    health_summary: cat.health_summary || '',
    last_checkup: cat.last_checkup || '',
    vaccinated: !!cat.vaccinated,
    sterilized: !!cat.sterilized,
    weight_kg: cat.weight_kg ?? '',
    personality: cat.personality || '',
    ready_for_adoption: !!cat.ready_for_adoption,
    featured: !!cat.featured,
    active: cat.active !== false,
    needsText: (cat.needs || []).join('\n'),
  };
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-foreground">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
      {label}
    </label>
  );
}

export default function CatFormDialog({ open, cat, saving, onOpenChange, onSave, onDelete }) {
  const [form, setForm] = useState(BLANK);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toForm(cat));
      setConfirmDelete(false);
    }
  }, [open, cat]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      photo_url: form.photo_url,
      age_label: form.age_label.trim(),
      sex: form.sex,
      location: form.location.trim(),
      health_status: form.health_status,
      health_summary: form.health_summary.trim(),
      last_checkup: form.last_checkup || undefined,
      vaccinated: form.vaccinated,
      sterilized: form.sterilized,
      weight_kg: form.weight_kg === '' ? undefined : Number(form.weight_kg),
      personality: form.personality.trim(),
      ready_for_adoption: form.ready_for_adoption,
      featured: form.featured,
      active: form.active,
      needs: form.needsText
        .split('\n')
        .map((n) => n.trim())
        .filter(Boolean),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[4px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-normal">
            {cat ? `Edit ${cat.name}` : 'Add a cat to the colony'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Photo"
                value={form.photo_url}
                alt={form.name || 'Cat photo'}
                onChange={(url) => set('photo_url', url)}
                hint="Public photo — shown on the landing page and in the studio."
              />
            </div>

            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cat-age">Age</Label>
              <Input
                id="cat-age"
                value={form.age_label}
                onChange={(e) => set('age_label', e.target.value)}
                placeholder="e.g. 4 months"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Health status</Label>
              <Select value={form.health_status} onValueChange={(v) => set('health_status', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(HEALTH_STATUSES).map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sex</Label>
              <Select value={form.sex} onValueChange={(v) => set('sex', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cat-location">Location on campus</Label>
              <Input
                id="cat-location"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="cat-checkup">Last checkup</Label>
              <Input
                id="cat-checkup"
                type="date"
                value={form.last_checkup}
                onChange={(e) => set('last_checkup', e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="cat-weight">Weight (kg)</Label>
              <Input
                id="cat-weight"
                type="number"
                step="0.1"
                min="0"
                value={form.weight_kg}
                onChange={(e) => set('weight_kg', e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <Toggle label="Vaccinated" checked={form.vaccinated} onChange={(v) => set('vaccinated', v)} />
                <Toggle label="Sterilised" checked={form.sterilized} onChange={(v) => set('sterilized', v)} />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="cat-summary">Health note</Label>
              <Textarea
                id="cat-summary"
                value={form.health_summary}
                onChange={(e) => set('health_summary', e.target.value)}
                rows={3}
                placeholder="Plain-language update visitors will read on the card."
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="cat-personality">Personality note</Label>
              <Input
                id="cat-personality"
                value={form.personality}
                onChange={(e) => set('personality', e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="cat-needs">Still needs (one per line)</Label>
              <Textarea
                id="cat-needs"
                value={form.needsText}
                onChange={(e) => set('needsText', e.target.value)}
                rows={3}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
            <Toggle
              label="Ready for adoption"
              checked={form.ready_for_adoption}
              onChange={(v) => set('ready_for_adoption', v)}
            />
            <Toggle label="Feature on the hero" checked={form.featured} onChange={(v) => set('featured', v)} />
            <Toggle label="Visible on site" checked={form.active} onChange={(v) => set('active', v)} />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {cat && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-[12px] text-destructive underline underline-offset-2"
                >
                  Delete this profile
                </button>
              )}
              {cat && confirmDelete && (
                <span className="flex items-center gap-3 text-[12px] text-muted-foreground">
                  Delete permanently?
                  <button type="button" onClick={() => onDelete(cat.id)} className="font-medium text-destructive">
                    Yes, delete
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="underline">
                    Cancel
                  </button>
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-[3px] border border-border px-4 py-2.5 text-[13px] text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="inline-flex items-center gap-2 rounded-[3px] bg-foreground px-5 py-2.5 text-[13px] font-medium text-background disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {cat ? 'Save changes' : 'Add cat'}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}