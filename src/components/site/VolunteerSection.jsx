import { CalendarDays, ArrowRight, ClipboardList, Stethoscope, Moon } from 'lucide-react';
import Reveal from './Reveal';
import { pageText } from '@/lib/pageText';

const ROLE_ICONS = [ClipboardList, Stethoscope, Moon];

export default function VolunteerSection({ settings }) {
  const ROLES = [1, 2, 3].map((n) => ({
    icon: ROLE_ICONS[n - 1],
    title: pageText(settings, `volunteer_role${n}_title`),
    commitment: pageText(settings, `volunteer_role${n}_commitment`),
    body: pageText(settings, `volunteer_role${n}_body`),
  }));

  return (
    <section id="volunteer" className="scroll-mt-20 bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-background/50">
              {pageText(settings, 'volunteer_eyebrow')}
            </p>
            <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,2.9rem)] text-background">
              {pageText(settings, 'volunteer_title')}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-background/65">
              {pageText(settings, 'volunteer_description')}
            </p>

            <div className="mt-8 rounded-[3px] border border-background/15 bg-background/5 p-5">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-background/50">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                {pageText(settings, 'volunteer_meeting_label')}
              </p>
              <p className="mt-2 font-heading text-lg text-background">{settings.meeting_info}</p>
              <p className="mt-1 text-[12.5px] text-background/55">
                {pageText(settings, 'volunteer_meeting_note')}
              </p>
            </div>

            <a
              href={`mailto:${settings.contact_email}?subject=I%20would%20like%20to%20volunteer`}
              className="group mt-6 inline-flex items-center gap-2 rounded-[3px] bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground transition-all hover:gap-3"
            >
              {pageText(settings, 'volunteer_cta')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-[4px] bg-background/15">
              {ROLES.map((role, i) => (
                <Reveal key={role.title} delay={i * 0.06} className="bg-foreground">
                  <div className="flex items-start gap-4 p-5 sm:p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-background/20">
                      <role.icon className="h-4 w-4 text-background/80" strokeWidth={1.7} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-heading text-[19px] text-background">{role.title}</h3>
                        <span className="text-[11px] uppercase tracking-[0.12em] text-background/45">
                          {role.commitment}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-background/60">{role.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-6 text-[12.5px] leading-relaxed text-background/45">
              {pageText(settings, 'volunteer_footnote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}