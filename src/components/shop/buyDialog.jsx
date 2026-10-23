import { useState } from 'react';
import { CheckCircle2, Loader2, ScanLine } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';

export default function BuyDialog({ item, paymentQr, onClose }) {
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (!item) return null;
  const total = (Number(item.price) * qty).toFixed(2);

  async function confirmPaid() {
    setSending(true);
    try {
      await base44.entities.Order.create({
        item_id: item.id,
        item_name: item.name,
        item_photo_url: item.photo_url || '',
        price: Number(item.price),
        quantity: qty,
        total: Number(total),
        status: 'pending_verification',
        pickup_code: '',
        code_redeemed: false,
      });
      setDone(true);
    } catch (error) {
      toast({
        title: 'Could not record the order',
        description: 'Try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setDone(false);
    setQty(1);
    onClose();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{done ? 'Order recorded' : `Buy ${item.name}`}</DialogTitle>
          <DialogDescription>
            {done
              ? 'The committee will check the payment and your pickup code will appear under “My orders”.'
              : 'Scan the QR code with your banking app, pay, then confirm below.'}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" strokeWidth={1.6} />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Thanks for supporting the colony! Your pickup code for{' '}
              <span className="font-medium text-foreground">{item.name}</span> will appear under “My orders” as
              soon as the payment is confirmed.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-[3px] bg-foreground px-4 py-3 text-[13px] font-medium text-background"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-border text-foreground"
              >
                −
              </button>
              <span className="min-w-[3ch] text-center font-heading text-lg text-foreground">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(5, q + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-border text-foreground"
              >
                +
              </button>
              <span className="text-[12px] text-muted-foreground">quantity</span>
              <span className="ml-auto font-heading text-lg text-foreground">${total}</span>
            </div>

            {paymentQr ? (
              <>
                <div className="rounded-[4px] border-2 border-accent bg-card p-3">
                  <Image
                    src={paymentQr}
                    alt="Payment QR code"
                    imgClassName="object-contain"
                    className="mx-auto aspect-square w-44"
                  />
                </div>
                <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  <ScanLine className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.8} />
                  Scan this code with your banking app and pay ${total} for {item.name}. Then tap the button
                  below — we check every payment before issuing a pickup code.
                </p>
                <button
                  type="button"
                  onClick={confirmPaid}
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[3px] bg-accent px-4 py-3 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                  I have paid — submit order
                </button>
              </>
            ) : (
              <p className="rounded-[3px] border border-border bg-secondary/50 px-3 py-3 text-center text-[12.5px] text-muted-foreground">
                The payment QR code is not set up yet. Ask the committee to upload it in the admin desk.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}