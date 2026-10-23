import { QrCode, ScanLine, HeartHandshake, ExternalLink } from 'lucide-react';
import Reveal from './Reveal';
import { pageText } from '@/lib/pageText';

export default function DonationStudio({ settings }) {
  const hasQr = Boolean(settings.donation_qr_url);
  const costs = [1, 2, 3].map((n) => ({
    title: pageText(settings, `donate_cost${n}_title`),
    body: pageText(settings, `donate_cost${n}_body`),
  }));

  return (
    <section id="donate" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-px w-6 bg-border" />
              {pageText(settings, 'donate_eyebrow')}
            </p>
            <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,2.9rem)] text-foreground">
              {pageText(settings, 'donate_title')}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {pageText(settings, 'donate_description')}
            </p>

            <div className="mt-8 space-y-5">
              {costs.map((cost) => (
                <div key={cost.title} className="flex gap-3">
                  <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} />
                  <div>
                    <p className="text-[14px] font-medium text-foreground">{cost.title}</p>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{cost.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 border-l-2 border-primary/40 pl-4 text-[12.5px] leading-relaxed text-muted-foreground">
              {pageText(settings, 'donate_receipt_note')}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-[4px] border border-border bg-card">
              <div className="pointer-events-none absolute inset-0 graph-paper opacity-30" />
              <div className="relative flex h-full flex-col items-center justify-center px-6 py-12 text-center sm:px-12">
                <p className="eyebrow flex items-center gap-2">
                  <ScanLine className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {pageText(settings, 'donate_scan_label')}
                </p>

                <div className="mt-6 rounded-[6px] p-[6px] ring-1 ring-accent/35">
                  <div className="rounded-[3px] bg-background p-3 sm:p-4">
                    {hasQr ? (
                      <img
                        src={settings.donation_qr_url}
                        alt="Donation QR code for the campus cat fund"
                        className="h-[200px] w-[200px] object-contain sm:h-[240px] sm:w-[240px]"
                      />
                    ) : (
                      <div className="flex h-[200px] w-[200px] flex-col items-center justify-center rounded-[2px] border border-dashed border-border sm:h-[240px] sm:w-[240px]">
                        <QrCode className="h-9 w-9 text-muted-foreground/60" strokeWidth={1.3} />
                        <p className="mt-3 px-6 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {pageText(settings, 'donate_qr_placeholder')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-6 max-w-sm font-heading text-lg text-foreground">
                  {hasQr
                    ? 'Point your camera at the code — it opens our donation page.'
                    : 'Our committee is setting up the donation code for this semester.'}
                </p>
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                  {hasQr
                    ? 'Any amount helps. Thank you for keeping the colony fed and healthy.'
                    : 'In the meantime, message the committee and we will arrange a transfer directly.'}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  {settings.donation_link && (
                    <a
                      href={settings.donation_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[3px] bg-accent px-5 py-3 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-90"
                    >
                      {pageText(settings, 'donate_cta_open')}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <a
                    href={`mailto:${settings.contact_email}?subject=Donation%20to%20the%20campus%20cat%20fund`}
                    className="inline-flex items-center gap-2 rounded-[3px] border border-border bg-background px-5 py-3 text-[13px] font-medium text-foreground transition-colors hover:border-primary/50"
                  >
                    {pageText(settings, 'donate_cta_email')}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}