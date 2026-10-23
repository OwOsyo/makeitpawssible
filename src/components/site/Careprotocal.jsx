import { Stethoscope, Home, Utensils, HeartPulse } from 'lucide-react';
import Reveal from './Reveal';
import { pageText } from '@/lib/pageText';

const STEP_ICONS = [Utensils, Stethoscope, HeartPulse, Home];

export default function CareProtocol({ settings }) {
  const STEPS = STEP_ICONS.map((icon, i) => ({
    icon,
    title: pageText(settings, `care_step${i + 1}_title`),
    body: pageText(settings, `care_step${i + 1}_body`),
  }));
  return (
    <section id="care" className="scroll-mt-20 border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-6 bg-border" />
            {pageText(settings, 'care_eyebrow')}
          </p>
          <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,2.9rem)] text-foreground">
            {pageText(settings, 'care_title')}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06} className="bg-background">
              <div className="h-full p-6 lg:p-7">
                <div className="flex items-center justify-between">
                  <step.icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                  <span className="font-heading text-sm text-muted-foreground/70">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-heading text-[19px] text-foreground">{step.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] text-muted-foreground">
          {pageText(settings, 'care_footnote')}
        </p>
      </div>
    </section>
  );
}