import { format } from 'date-fns';
import { Stethoscope, ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { statusMeta } from '@/lib/health';

export default function CatCard({ cat, onOpen }) {
  const status = statusMeta(cat.health_status);

  return (
    <button
      type="button"
      onClick={() => onOpen(cat)}
      className="group block w-full overflow-hidden rounded-[4px] border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_26px_50px_-34px_rgba(26,28,30,0.5)]"
    >
      <div className="relative overflow-hidden">
        <Image
          src={cat.photo_url}
          alt={`${cat.name}, a cat in our care`}
          className="h-[300px] w-full transition-transform duration-700 group-hover:scale-[1.04] sm:h-[340px]"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557]/75 via-[#1D3557]/5 to-transparent" />
        <div className="absolute inset-0 bg-[#457B9D]/0 transition-colors duration-500 group-hover:bg-[#457B9D]/10" />

        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] backdrop-blur ${status.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        {cat.ready_for_adoption && (
          <span className="absolute right-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-foreground">
            Adoptable
          </span>
        )}

        <div className="absolute inset-x-4 bottom-4">
          <p className="font-heading text-2xl text-[#F1FAEE]">{cat.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[#F1FAEE]/70">
            {cat.age_label} · {cat.sex} · {cat.location}
          </p>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4 pt-4">
        <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">{cat.health_summary}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
            Checked {cat.last_checkup ? format(new Date(cat.last_checkup), 'd MMM') : 'recently'}
          </span>
          <span className="flex items-center gap-1 font-medium text-foreground/80 transition-colors group-hover:text-accent">
            Health chart
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}