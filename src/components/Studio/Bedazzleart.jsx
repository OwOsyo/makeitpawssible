import { Image } from '@/components/ui/image';
import Decoration from './Decoration';

const strokePath = (points = []) =>
  points.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');

export default function BedazzleArt({ imageUrl, gems = [], alt, className = '' }) {
  const placed = gems.filter((g) => (g.kind || 'shape') !== 'pen');
  const strokes = gems.filter((g) => g.kind === 'pen');

  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      <Image src={imageUrl} alt={alt} className="h-full w-full" fittingType="fill" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {strokes.map((s, i) => (
          <path
            key={i}
            d={strokePath(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.size}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {placed.map((gem, i) => {
        const isText = (gem.kind || 'shape') === 'text';
        return (
          <span
            key={i}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${gem.x}%`,
              top: `${gem.y}%`,
              transform: `translate(-50%, -50%) rotate(${gem.rotation || 0}deg)`,
              ...(isText ? { width: '76%', textAlign: 'center' } : null),
            }}
          >
            <Decoration item={gem} />
          </span>
        );
      })}
    </div>
  );
}