import { ArrowRight, HeartPulse, MapPin } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { statusMeta } from '@/lib/health';
import { pageText } from '@/lib/pageText';

const HERO_IMAGE =
'https://media.base44.com/images/public/6ad85359e7da517b8f9d5d19/2533e2552_generated_71a204cf.png';

export default function Hero({ settings, featuredCat }) {
  const status = featuredCat ? statusMeta(featuredCat.health_status) : null;

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 graph-paper opacity-[0.35]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-6 bg-border" />
            GUIS ULC · Run by student volunteers
          </p>
          <h1 className="mt-6 font-heading text-[clamp(2.4rem,5.4vw,3.9rem)] text-foreground">
            {pageText(settings, 'hero_title')}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            {pageText(settings, 'hero_subtitle')}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#cats"
              className="group inline-flex items-center gap-2 rounded-[3px] bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:gap-3">
              
              {pageText(settings, 'hero_cta_primary')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#donate"
              className="inline-flex items-center gap-2 rounded-[3px] border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50">
              
              <HeartPulse className="h-4 w-4 text-accent" strokeWidth={1.8} />
              {pageText(settings, 'hero_cta_secondary')}
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-[13px] text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.8} />
            <span>{pageText(settings, 'hero_note')} {settings.meeting_info.split('·')[0].trim()}</span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -right-3 -top-3 hidden h-full w-full rounded-[4px] border border-primary/25 sm:block" />
            <div className="relative overflow-hidden rounded-[4px] border border-border bg-secondary">
              <Image
                src={featuredCat?.photo_url || HERO_IMAGE}
                alt={featuredCat ? `${featuredCat.name}, a cat in our care` : 'A kitten in the school library'}
                className="h-[420px] w-full sm:h-[520px] lg:h-[560px]"
                fittingType="fill" />
              
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1D3557]/70 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <div className="text-background">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-background/70">Cat of the month</p>
                  <p className="font-heading text-2xl">{featuredCat?.name || 'Clementine'}</p>
                </div>
                {status &&
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide backdrop-blur ${status.pill}`}>
                  
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                }
              </div>
            </div>

            {featuredCat &&
            <div className="relative z-10 mx-4 -mt-8 rounded-[3px] border border-border bg-card p-4 shadow-[0_18px_40px_-28px_rgba(26,28,30,0.45)] sm:absolute sm:-right-5 sm:top-8 sm:mx-0 sm:mt-0 sm:max-w-[230px] hidden">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Latest chart note</p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground">{featuredCat.health_summary}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>);

}