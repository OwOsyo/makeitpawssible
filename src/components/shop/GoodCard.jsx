import { Image } from '@/components/ui/image';

export default function GoodCard({ item, onBuy }) {
  const soldOut = !item.stock || item.stock <= 0;
  return (
    <div className="flex flex-col overflow-hidden rounded-[4px] border border-border bg-card">
      <div className="relative aspect-[4/5] bg-secondary">
        {item.photo_url ? (
          <Image src={item.photo_url} alt={item.name} className="h-full w-full" fittingType="fill" />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-muted-foreground">
            No photo yet
          </div>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-[3px] bg-foreground px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-background">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-[16px] leading-snug text-foreground">{item.name}</h3>
          <p className="shrink-0 font-heading text-[16px] text-foreground">${Number(item.price).toFixed(2)}</p>
        </div>
        {item.description && (
          <p className="line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">{item.description}</p>
        )}
        <button
          type="button"
          onClick={() => onBuy(item)}
          disabled={soldOut}
          className="mt-auto w-full rounded-[3px] bg-accent px-4 py-2.5 text-[12.5px] font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {soldOut ? 'Sold out' : 'Buy'}
        </button>
      </div>
    </div>
  );
}