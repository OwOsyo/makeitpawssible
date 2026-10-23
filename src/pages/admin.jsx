import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import SiteHeader from '@/components/site/SiteHeader';
import CatManager from '@/components/admin/CatManager';
import DonationSettingsForm from '@/components/admin/DonationSettingsForm';
import PageTextForm from '@/components/admin/PageTextForm';
import TeamManager from '@/components/admin/TeamManager';
import ShopPaymentForm from '@/components/admin/ShopPaymentForm';
import ShopItemManager from '@/components/admin/ShopItemManager';
import OrderManager from '@/components/admin/OrderManager';

export default function Admin() {
  const { user, isLoadingAuth } = useAuth();
  const [tab, setTab] = useState('cats');
  const [cats, setCats] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  const load = useCallback(async () => {
    const [catList, siteList] = await Promise.all([
      base44.entities.Cat.list('-created_date'),
      base44.entities.SiteSetting.list(),
    ]);
    setCats([...catList].sort((a, b) => a.name.localeCompare(b.name)));
    setSettings(siteList?.[0] || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
          <ShieldAlert className="h-7 w-7 text-accent" strokeWidth={1.6} />
          <h1 className="mt-4 font-heading text-2xl text-foreground">This desk is for administrators.</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Your account does not have admin access. Ask the committee's account owner to grant it, or head back to
            the colony.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-[3px] bg-foreground px-5 py-3 text-[13px] font-medium text-background"
          >
            Back to the colony
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-border" />
          Guardian desk
        </p>
        <h1 className="mt-4 font-heading text-[clamp(1.9rem,3.6vw,2.7rem)] text-foreground">
          Keep the charts and the donation code current.
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          Everything you change here shows up on the site straight away.
        </p>

        <div className="mt-7 inline-flex max-w-full overflow-x-auto rounded-[3px] border border-border">
          {[
            { key: 'cats', label: 'Cat profiles' },
            { key: 'donation', label: 'Donation & site' },
            { key: 'text', label: 'Page text' },
            { key: 'shop', label: 'Shop items' },
            { key: 'orders', label: 'Orders & codes' },
            { key: 'team', label: 'Team' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`px-5 py-2.5 text-[12.5px] transition-colors ${
                tab === item.key ? 'bg-foreground text-background' : 'bg-card text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'cats' ? (
            <CatManager cats={cats} loading={loading} onChanged={load} />
          ) : tab === 'text' ? (
            <PageTextForm settings={settings} onSaved={load} />
          ) : tab === 'shop' ? (
            <>
              <ShopPaymentForm settings={settings} onSaved={load} />
              <div className="mt-6">
                <ShopItemManager />
              </div>
            </>
          ) : tab === 'orders' ? (
            <OrderManager />
          ) : tab === 'team' ? (
            <TeamManager />
          ) : (
            <DonationSettingsForm settings={settings} onSaved={load} />
          )}
        </div>
      </main>
    </div>
  );
}