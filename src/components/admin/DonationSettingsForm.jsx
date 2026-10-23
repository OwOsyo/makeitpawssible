import { useEffect, useState } from 'react';
import { Loader2, QrCode } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadField from './ImageUploadField';

const BLANK = {
  collective_name: '',
  school_name: '',
  tagline: '',
  contact_email: '',
  meeting_info: '',
  donation_link: '',
  donation_qr_url: '',
};

export default function DonationSettingsForm({ settings, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      collective_name: settings?.collective_name || '',
      school_name: settings?.school_name || '',
      tagline: settings?.tagline || '',
      contact_email: settings?.contact_email || '',
      meeting_info: settings?.meeting_info || '',
      donation_link: settings?.donation_link || '',
      donation_qr_url: settings?.donation_qr_url || '',
    });
  }, [settings]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      if (settings?.id) await base44.entities.SiteSetting.update(settings.id, form);
      else await base44.entities.SiteSetting.create(form);
      await onSaved();
      toast({ title: 'Settings saved', description: 'The donation panel is up to date.' });
    } catch (error) {
      toast({ title: 'Could not save', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-[4px] border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-accent" strokeWidth={1.8} />
          <h2 className="font-heading text-xl text-foreground">Donation panel</h2>
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
          The QR image sits in the golden frame on the donate section. Anyone visiting the site scans it directly.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Donation QR code"
              value={form.donation_qr_url}
              alt="Donation QR code"
              imgClassName="object-contain"
              onChange={(url) => set('donation_qr_url', url)}
              hint="Upload a square PNG from your PayNow / bank app for best results."
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="donation-link">Donation link (optional)</Label>
            <Input
              id="donation-link"
              value={form.donation_link}
              onChange={(e) => set('donation_link', e.target.value)}
              placeholder="https://…"
              className="mt-1.5"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Shown as an “Open donation page” button under the QR code.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[4px] border border-border bg-card p-5">
        <h2 className="font-heading text-xl text-foreground">Collective details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="collective-name">Collective name</Label>
            <Input
              id="collective-name"
              value={form.collective_name}
              onChange={(e) => set('collective_name', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="school-name">School</Label>
            <Input
              id="school-name"
              value={form.school_name}
              onChange={(e) => set('school_name', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="contact-email">Contact email</Label>
            <Input
              id="contact-email"
              type="email"
              value={form.contact_email}
              onChange={(e) => set('contact_email', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="meeting-info">Weekly meeting</Label>
            <Input
              id="meeting-info"
              value={form.meeting_info}
              onChange={(e) => set('meeting_info', e.target.value)}
              placeholder="Thursdays, 3.30pm · Science Block, Room 2"
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-[3px] bg-foreground px-5 py-3 text-[13px] font-medium text-background disabled:opacity-50"
      >
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save settings
      </button>
    </form>
  );
}