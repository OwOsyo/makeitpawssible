import { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, Clock, MapPin, PackageCheck, ShieldX } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Image } from '@/components/ui/image';

const STATUS_META = {
  paid: { label: 'Ready to pick up', icon: BadgeCheck, className: 'text-primary' },
  pending_verification: { label: 'Checking your payment', icon: Clock, className: 'text-accent' },
  collected: { label: 'Collected', icon: PackageCheck, className: 'text-muted-foreground' },
  rejected: { label: 'Payment not confirmed', icon: ShieldX, className: 'text-destructive' },
};

export default function MyOrders({ pickupLocation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const page = await base44.entities.Order.filter(
      { created_by_id: user.id },
      { sort: '-created_date', limit: 20 }
    );
    setOrders(page.items ?? []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
    const unsubscribe = base44.entities.Order.subscribe(() => load());
    return unsubscribe;
  }, [load]);

  return (
    <section className="mt-14 border-t border-border pt-8">
      <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] text-foreground">My orders</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Your pickup code appears here once the committee confirms your payment.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const meta = STATUS_META[order.status] || STATUS_META.pending_verification;
          const Icon = meta.icon;
          return (
            <div key={order.id} className="overflow-hidden rounded-[4px] border border-border bg-card">
              <div className="flex gap-3 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[3px] bg-secondary">
                  {order.item_photo_url && (
                    <Image src={order.item_photo_url} alt={order.item_name} className="h-full w-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-[15px] text-foreground">{order.item_name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {order.quantity} × ${Number(order.price).toFixed(2)} ·{' '}
                    {order.created_date
                      ? formatDistanceToNow(new Date(order.created_date), { addSuffix: true })
                      : 'just now'}
                  </p>
                  <p className={`mt-1 flex items-center gap-1 text-[11.5px] font-medium ${meta.className}`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {meta.label}
                  </p>
                </div>
              </div>
              {order.status === 'paid' && (
                <div className="border-t border-border bg-secondary/50 px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pickup code</p>
                  <p className="mt-1 font-mono text-xl tracking-[0.18em] text-foreground">{order.pickup_code}</p>
                  <p className="mt-2 flex items-center justify-center gap-1 text-[11.5px] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {pickupLocation || 'Pickup spot set by the committee'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {orders.length === 0 && !loading && (
        <p className="mt-4 text-[13px] text-muted-foreground">
          No orders yet — buy something above to get started.
        </p>
      )}
    </section>
  );
}