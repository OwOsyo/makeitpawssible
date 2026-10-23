import { useRef, useState } from 'react';
import BedazzleArt from './BedazzleArt';

export default function BedazzleCanvas({ cat, gems, isPen, penColor, penWidth, onPlace, onDrawEnd, hint }) {
  const drawingRef = useRef(false);
  const [points, setPoints] = useState(null);

  function posPercent(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    return [Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y))];
  }

  function handleClick(event) {
    if (isPen) return;
    const [x, y] = posPercent(event);
    onPlace(Math.min(96, Math.max(4, x)), Math.min(96, Math.max(4, y)));
  }

  function handlePointerDown(event) {
    if (!isPen) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    setPoints([posPercent(event)]);
  }

  function handlePointerMove(event) {
    if (!drawingRef.current) return;
    const [x, y] = posPercent(event);
    setPoints((prev) => {
      const last = prev?.[prev.length - 1];
      if (last && Math.abs(last[0] - x) < 0.6 && Math.abs(last[1] - y) < 0.6) return prev;
      return [...prev, [x, y]];
    });
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (points && points.length > 1) onDrawEnd(points);
    setPoints(null);
  }

  return (
    <div>
      <div
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative aspect-[4/5] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-[4px] border border-border"
      >
        <BedazzleArt
          imageUrl={cat.photo_url}
          alt={`${cat.name}, ready to be bedazzled`}
          gems={gems}
          className="h-full w-full"
        />
        {points && points.length > 1 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={points.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')}
              fill="none"
              stroke={penColor}
              strokeWidth={penWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        {gems.length === 0 && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[3px] bg-background/90 px-3 py-2 text-center text-[11.5px] text-muted-foreground backdrop-blur">
            {hint || 'Tap the photo to place your first gem'}
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-[11.5px] text-muted-foreground">
        {gems.length} decoration{gems.length === 1 ? '' : 's'} on {cat.name}
      </p>
    </div>
  );
}