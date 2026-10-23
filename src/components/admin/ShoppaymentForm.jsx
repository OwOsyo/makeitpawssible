import { useEffect, useState } from 'react';
import { Loader2, MapPin, QrCode } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadField from './ImageUploadField';

const BLANK = { payment_qr_url: '', pickup_location: '' };

export default function ShopPaymentForm({ settings, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      payment_qr_url: settings?.payment_qr_url || '',
      pickup_location: settings?.pickup_location || '',
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
      toast({ title: 'Shop settings saved', description: 'Buyers will see the new QR and pickup spot.' });
    } catch (error) {
      toast({ title: 'Could not save', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[4px] border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-accent" strokeWidth={1.8} />
        <h2 className="font-heading text-xl text-foreground">Payment & pickup</h2>
      </div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
        Buyers scan this QR to pay for their order. The pickup spot is shown with every confirmed code.
      </p>

      <div className="mt-5 space-y-5">
        <ImageUploadField
          label="Payment QR code"
          value={form.payment_qr_url}
          alt="Shop payment QR code"
          imgClassName="object-contain"
          onChange={(url) => set('payment_qr_url', url)}
          hint="A square PNG from your PayNow / bank app works best."
        />
        <div>
          <Label htmlFor="pickup-location" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
            Pickup location
          </Label>
          <Input
            id="pickup-location"
            value={form.pickup_location}
            onChange={(e) => set('pickup_location', e.target.value)}
            placeholder="Science Block, Room 2 · weekdays after 3pm"
            className="mt-1.5"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-5 inline-flex items-center gap-2 rounded-[3px] bg-foreground px-5 py-3 text-[13px] font-medium text-background disabled:opacity-50"
      >
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save shop settings
      </button>
    </form>
  );
}