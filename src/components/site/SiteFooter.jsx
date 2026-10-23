import { Mail, PawPrint, MapPin } from 'lucide-react';
import { pageText } from '@/lib/pageText';

export default function SiteFooter({ settings }) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-primary text-primary-foreground">
              <PawPrint className="h-3.5 w-3.5" strokeWidth={1.9} />
            </span>
            <p className="font-heading text-[17px] text-foreground">{settings.collective_name}</p>
          </div>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">{settings.tagline}</p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
            <li><a href="#cats" className="transition-colors hover:text-foreground">The colony</a></li>
            <li><a href="#care" className="transition-colors hover:text-foreground">How we care</a></li>
            <li><a href="#donate" className="transition-colors hover:text-foreground">Donate</a></li>
            <li><a href="#volunteer" className="transition-colors hover:text-foreground">Volunteer</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Reach us</p>
          <ul className="mt-4 space-y-3 text-[13px] text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.7} />
              <a href={`mailto:${settings.contact_email}`} className="break-all transition-colors hover:text-foreground">
                {settings.contact_email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.7} />
              <span>{settings.school_name}<br />{settings.meeting_info}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[11.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} {settings.collective_name}. {pageText(settings, 'footer_colophon')}</p>
          <p>{pageText(settings, 'footer_donation_note')}</p>
        </div>
      </div>
    </footer>
  );
}