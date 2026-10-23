import { format } from 'date-fns';
import { Check, CircleDot, MapPin, Package, Syringe, Weight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { statusMeta } from '@/lib/health';

function Vital({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[3px] border border-border bg-background/60 p-3">
      <Icon className="h-4 w-4 text-primary" strokeWidth={1.7} />
      <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="text-[13px] font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function CatDossier({ cat, open, onOpenChange }) {
  if (!cat) return null;
  const status = statusMeta(cat.health_status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[4px] border-border bg-card p-0">
        <div className="grid sm:grid-cols-2">
          <div className="relative">
            <Image
              src={cat.photo_url}
              alt={`${cat.name}, a cat in our care`}
              className="h-[280px] w-full sm:h-full sm:min-h-[440px]"
              fittingType="fill"
            />
          </div>

          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] ${status.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              {cat.ready_for_adoption && (
                <span className="rounded-full border border-primary/30 bg-[#A8DADC]/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#1D3557]">
                  Ready for adoption
                </span>
              )}
            </div>

            <DialogTitle className="mt-4 font-heading text-3xl font-normal text-foreground">{cat.name}</DialogTitle>
            <DialogDescription className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
              {cat.location} · {cat.age_label} · {cat.sex}
            </DialogDescription>

            <div className="mt-5 border-t border-border pt-4">
              <p className="eyebrow">Health note</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">{cat.health_summary}</p>
              {cat.personality && (
                <p className="mt-2 text-[13px] italic leading-relaxed text-muted-foreground">{cat.personality}</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Vital icon={Syringe} label="Vaccinated" value={cat.vaccinated ? 'Yes' : 'Pending'} />
              <Vital icon={CircleDot} label="Sterilised" value={cat.sterilized ? 'Yes' : 'Scheduled'} />
              <Vital icon={Weight} label="Weight" value={cat.weight_kg ? `${cat.weight_kg} kg` : '—'} />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[3px] bg-secondary px-3 py-2.5 text-[12px] text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              Last vet check {cat.last_checkup ? format(new Date(cat.last_checkup), 'd MMMM yyyy') : 'recently'}
            </div>

            {cat.needs?.length > 0 && (
              <div className="mt-5">
                <p className="eyebrow flex items-center gap-1.5">
                  <Package className="h-3 w-3" strokeWidth={2} />
                  What this cat still needs
                </p>
                <ul className="mt-2 space-y-1.5">
                  {cat.needs.map((need) => (
                    <li key={need} className="flex items-start gap-2 text-[13px] text-foreground/85">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {need}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href="#donate"
              onClick={() => onOpenChange(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-[3px] bg-foreground px-4 py-3 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
            >
              Help fund {cat.name}&apos;s care
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}