import { useEffect, useState } from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/site/SiteHeader';
import GoodCard from '@/components/shop/GoodCard';
import BuyDialog from '@/components/shop/BuyDialog';
import MyOrders from '@/components/shop/MyOrders';

export default function Shop() {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyItem, setBuyItem] = useState(null);

  useEffect(() => {
    (async () => {
      const [itemList, siteList] = await Promise.all([
        base44.entities.ShopItem.filter({ active: true }),
        base44.entities.SiteSetting.list(),
      ]);
      setItems(itemList);
      setSettings(siteList?.[0] || null);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-border" />
          Colony shop
        </p>
        <h1 className="mt-4 font-heading text-[clamp(2rem,4vw,2.9rem)] text-foreground">
          Take a little of the colony home.
        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          Key rings, stickers and other treats made by the volunteer team. Every dollar goes back into cat food
          and vet bills.
        </p>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-[4px] border border-dashed border-border bg-card px-6 py-12 text-center">
            <ShoppingBag className="mx-auto h-7 w-7 text-muted-foreground/50" strokeWidth={1.5} />
            <p className="mt-3 font-heading text-lg text-foreground">To be continued…</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              The shelves are empty for now — new goodies are added by the committee, so check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <GoodCard key={item.id} item={item} onBuy={setBuyItem} />
            ))}
          </div>
        )}

        <MyOrders pickupLocation={settings?.pickup_location} />
      </main>

      {buyItem && (
        <BuyDialog
          item={buyItem}
          paymentQr={settings?.payment_qr_url}
          onClose={() => setBuyItem(null)}
        />
      )}
    </div>
  );
}