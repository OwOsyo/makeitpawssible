import { useState } from 'react';
import { Cat, Loader2 } from 'lucide-react';
import CatCard from './CatCard';
import CatDossier from './CatDossier';
import Reveal from './Reveal';
import { FILTERS } from '@/lib/health';
import { pageText } from '@/lib/pageText';

export default function CatLedger({ cats, filter, onFilterChange, loading, settings }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id="cats" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-6 bg-border" />
            {pageText(settings, 'ledger_eyebrow')}
          </p>
          <h2 className="mt-4 max-w-lg font-heading text-[clamp(2rem,4vw,2.9rem)] text-foreground">
            {pageText(settings, 'ledger_title')}
          </h2>
        </div>
        <p className="max-w-xs text-[14px] leading-relaxed text-muted-foreground">
          {pageText(settings, 'ledger_subtitle')}
        </p>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`rounded-full border px-4 py-2 text-[12px] tracking-wide transition-all ${
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[420px] animate-pulse rounded-[4px] border border-border bg-secondary/60" />
          ))}
          <div className="col-span-full flex items-center justify-center gap-2 py-4 text-[13px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading the charts…
          </div>
        </div>
      ) : cats.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[4px] border border-dashed border-border px-6 py-16 text-center">
          <Cat className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 font-heading text-xl text-foreground">{pageText(settings, 'ledger_empty_title')}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">{pageText(settings, 'ledger_empty_subtitle')}</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat, i) => (
            <Reveal key={cat.id} delay={Math.min(i * 0.05, 0.25)}>
              <CatCard cat={cat} onOpen={setSelected} />
            </Reveal>
          ))}
        </div>
      )}

      <CatDossier cat={selected} open={!!selected} onOpenChange={(v) => !v && setSelected(null)} />
    </section>
  );
}