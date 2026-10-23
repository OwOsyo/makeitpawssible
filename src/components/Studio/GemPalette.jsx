import { GEM_COLORS, GEM_GLYPHS, GEM_SIZES, PEN_WIDTHS, TEXT_FONTS } from '@/lib/gems';
import { Input } from '@/components/ui/input';

const MODES = [
  { key: 'shape', label: 'Gems' },
  { key: 'pen', label: 'Pen' },
  { key: 'text', label: 'Text' },
];

function Block({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function GemPalette({ mode, glyph, penWidth, color, size, text, font, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex overflow-hidden rounded-[3px] border border-border">
        {MODES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange({ mode: item.key })}
            className={`flex-1 px-2 py-2 text-[11.5px] transition-colors ${
              mode === item.key ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {mode === 'shape' && (
        <Block title="Pure colour shapes">
          <div className="flex flex-wrap gap-1.5">
            {GEM_GLYPHS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ glyph: g })}
                className={`flex h-9 w-9 items-center justify-center rounded-[3px] border text-lg transition-colors ${
                  glyph === g
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-foreground hover:border-foreground/40'
                }`}
                style={glyph === g ? undefined : { color }}
              >
                {g}
              </button>
            ))}
          </div>
        </Block>
      )}

      {mode === 'pen' && (
        <Block title="Pen">
          <div className="rounded-[3px] border border-border bg-secondary/50 px-3 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
            Press and drag on the photo to draw freehand strokes with the pen.
          </div>
        </Block>
      )}

      {mode === 'text' && (
        <Block title="Your words">
          <Input
            value={text}
            onChange={(e) => onChange({ text: e.target.value })}
            maxLength={60}
            placeholder="Best cat on campus"
            className="h-10 text-[13px]"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {TEXT_FONTS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => onChange({ font: f.key })}
                className={`rounded-[3px] border px-3 py-1.5 text-[12px] transition-colors ${
                  font === f.key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Type your words, then tap the photo to place them.
          </p>
        </Block>
      )}

      <Block title="Colour">
        <div className="flex flex-wrap gap-2">
          {GEM_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={c.name}
              onClick={() => onChange({ color: c.value })}
              className={`h-7 w-7 rounded-full border transition-transform ${
                color === c.value ? 'scale-110 border-foreground' : 'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </Block>

      <Block title={mode === 'pen' ? 'Pen width' : 'Size'}>
        <div className="inline-flex overflow-hidden rounded-[3px] border border-border">
          {(mode === 'pen' ? PEN_WIDTHS : GEM_SIZES).map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange(mode === 'pen' ? { penWidth: s.value } : { size: s.value })}
              className={`px-4 py-1.5 text-[12px] transition-colors ${
                (mode === 'pen' ? penWidth : size) === s.value
                  ? 'bg-foreground text-background'
                  : 'bg-background text-muted-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Block>
    </div>
  );
}