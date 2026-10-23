import { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, Loader2, ScanSearch, ShieldX, TicketCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image } from '@/components/ui/image';

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode() {
  const body = Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
  return `CAT-${body}`;
}

const STATUS_BADGE = {
  pending_verification: 'bg-accent/15 text-accent',
  paid: 'bg-primary/15 text-primary',
  collected: 'bg-secondary text-muted-foreground',
  rejected: 'bg-destructive/10 text-destructive',
};

export default function OrderManager() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [checking, setChecking] = useState(false);

  const load = useCallback(async () => {
    const [orderList, itemList] = await Promise.all([
      base44.entities.Order.list('-created_date'),
      base44.entities.ShopItem.list(),
    ]);
    setOrders(orderList);
    setItems(itemList);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmPayment(order) {
    setBusyId(order.id);
    try {
      const code = generateCode();
      await base44.entities.Order.update(order.id, {
        status: 'paid',
        pickup_code: code,
      });
      const item = items.find((i) => i.id === order.item_id);
      if (item && order.quantity) {
        await base44.entities.ShopItem.update(item.id, {
          stock: Math.max(0, (item.stock || 0) - order.quantity),
        });
      }
      await load();
      toast({ title: 'Payment confirmed', description: `Pickup code ${code} sent to ${order.buyer_email}.` });
    } catch (error) {
      toast({ title: 'Could not confirm', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  }

  async function reject(order) {
    setBusyId(order.id);
    try {
      await base44.entities.Order.update(order.id, { status: 'rejected' });
      await load();
      toast({ title: 'Order rejected' });
    } catch (error) {
      toast({ title: 'Could not reject', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  }

  async function redeemCode(event) {
    event.preventDefault();
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setChecking(true);
    try {
      const matches = await base44.entities.Order.filter({ pickup_code: code });
      const order = matches[0];
      if (!order) {
        toast({ title: 'Code not found', description: 'Check the code and try again.', variant: 'destructive' });
      } else if (order.status === 'collected' || order.code_redeemed) {
        toast({
          title: 'Code already used',
          description: 'This code was redeemed and can never be used again.',
          variant: 'destructive',
        });
      } else if (order.status !== 'paid') {
        toast({
          title: 'Payment not confirmed yet',
          description: 'This order is still waiting for payment confirmation.',
          variant: 'destructive',
        });
      } else {
        await base44.entities.Order.update(order.id, {
          status: 'collected',
          code_redeemed: true,
          redeemed_date: new Date().toISOString(),
        });
        await load();
        setCodeInput('');
        toast({
          title: 'Code authenticated',
          description: `${order.item_name} handed over. The code is now useless forever.`,
        });
      }
    } catch (error) {
      toast({ title: 'Could not check the code', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setChecking(false);
    }
  }

  const pending = orders.filter((o) => o.status === 'pending_verification');
  const processed = orders.filter((o) => o.status !== 'pending_verification');

  return (
    <div className="space-y-6">
      <form
        onSubmit={redeemCode}
        className="rounded-[4px] border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2">
          <ScanSearch className="h-4 w-4 text-accent" strokeWidth={1.8} />
          <h2 className="font-heading text-xl text-foreground">Authenticate a pickup code</h2>
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
          Type the code the buyer shows you. Once authenticated it is permanently useless.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="redeem-code">Pickup code</Label>
            <Input
              id="redeem-code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="CAT-XXXXXX"
              className="mt-1.5 font-mono uppercase tracking-[0.15em]"
            />
          </div>
          <button
            type="submit"
            disabled={checking}
            className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-foreground px-5 py-2.5 text-[13px] font-medium text-background disabled:opacity-50"
          >
            {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TicketCheck className="h-3.5 w-3.5" />}
            Authenticate
          </button>
        </div>
      </form>

      <div className="rounded-[4px] border border-border bg-card p-5">
        <h2 className="font-heading text-xl text-foreground">Waiting for payment check</h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
          Confirm once you see the money in the account — the buyer instantly gets their pickup code.
        </p>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : pending.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-muted-foreground">Nothing waiting — all clear.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pending.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-3 rounded-[4px] border border-border p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[3px] bg-secondary">
                  {order.item_photo_url && (
                    <Image src={order.item_photo_url} alt={order.item_name} className="h-full w-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-foreground">
                    {order.item_name} × {order.quantity}
                  </p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    ${Number(order.total).toFixed(2)} · {order.buyer_email} ·{' '}
                    {order.created_date
                      ? formatDistanceToNow(new Date(order.created_date), { addSuffix: true })
                      : 'just now'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => confirmPayment(order)}
                    disabled={busyId === order.id}
                    className="inline-flex items-center gap-1.5 rounded-[3px] bg-primary px-3 py-2 text-[12px] font-medium text-primary-foreground disabled:opacity-40"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Confirm payment
                  </button>
                  <button
                    type="button"
                    onClick={() => reject(order)}
                    disabled={busyId === order.id}
                    className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-40"
                  >
                    <ShieldX className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[4px] border border-border bg-card p-5">
        <h2 className="font-heading text-xl text-foreground">Order history</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : processed.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-muted-foreground">No processed orders yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {processed.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] text-foreground">
                    {order.item_name} × {order.quantity} · {order.buyer_email}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {order.pickup_code && (
                      <span className="font-mono tracking-[0.12em]">{order.pickup_code} · </span>
                    )}
                    {order.code_redeemed ? 'code redeemed' : 'code active'}
                    {order.redeemed_date && ` · ${formatDistanceToNow(new Date(order.redeemed_date), { addSuffix: true })}`}
                  </p>
                </div>
                <span
                  className={`rounded-[3px] px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${STATUS_BADGE[order.status]}`}
                >
                  {order.status.replace('_', ' ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}