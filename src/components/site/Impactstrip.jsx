import Reveal from './Reveal';
import { pageText } from '@/lib/pageText';

export default function ImpactStrip({ cats, settings }) {
  const inCare = cats.length;
  const needingCare = cats.filter((c) => ['treatment', 'recovering', 'special'].includes(c.health_status)).length;
  const adoptable = cats.filter((c) => c.ready_for_adoption).length;

  const stats = [
    { value: String(inCare).padStart(2, '0'), label: pageText(settings, 'stat_1_label') },
    { value: String(needingCare).padStart(2, '0'), label: pageText(settings, 'stat_2_label') },
    { value: String(adoptable).padStart(2, '0'), label: pageText(settings, 'stat_3_label') },
    { value: pageText(settings, 'stat_4_value'), label: pageText(settings, 'stat_4_label') },
  ];

  return (
    <Reveal className="border-y border-border bg-card/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:gap-0">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-2 lg:px-8 ${i !== 0 ? 'lg:border-l lg:border-border' : ''}`}
          >
            <p className="font-heading text-4xl text-foreground">{stat.value}</p>
            <p className="mt-1.5 text-[12px] uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}