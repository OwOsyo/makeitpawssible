import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/site/SiteHeader';
import Hero from '@/components/site/Hero';
import ImpactStrip from '@/components/site/ImpactStrip';
import CatLedger from '@/components/site/CatLedger';
import CareProtocol from '@/components/site/CareProtocol';
import DonationStudio from '@/components/site/DonationStudio';
import VolunteerSection from '@/components/site/VolunteerSection';
import SiteFooter from '@/components/site/SiteFooter';

const DEFAULTS = {
  collective_name: 'Campus Cat Collective',
  school_name: 'Our school',
  tagline: 'A student-run rescue for the cats who live on our campus.',
  contact_email: 'campuscats@riverside.edu.sg',
  meeting_info: 'Thursdays, 3.30pm · Science Block, Room 2',
  donation_qr_url: null,
  donation_link: null,
};

const byName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));

export default function Landing() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [cats, setCats] = useState([]);
  const [visibleCats, setVisibleCats] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [catList, siteList] = await Promise.all([
        base44.entities.Cat.filter({ active: true }),
        base44.entities.SiteSetting.list(),
      ]);
      if (cancelled) return;
      setCats(byName(catList));
      if (siteList?.[0]) setSettings({ ...DEFAULTS, ...siteList[0] });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const query = filter === 'all' ? { active: true } : { active: true, health_status: filter };
      const list = await base44.entities.Cat.filter(query);
      if (!cancelled) setVisibleCats(byName(list));
    })();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const featuredCat = cats.find((cat) => cat.featured) || cats[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader settings={settings} />
      <main>
        <Hero settings={settings} featuredCat={featuredCat} />
        <ImpactStrip cats={cats} settings={settings} />
        <CatLedger
          cats={visibleCats}
          filter={filter}
          onFilterChange={setFilter}
          settings={settings}
          loading={loading && visibleCats.length === 0}
        />
        <CareProtocol settings={settings} />
        <DonationStudio settings={settings} />
        <VolunteerSection settings={settings} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}