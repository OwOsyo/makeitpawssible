import { motion } from 'framer-motion';
import DiamondSticker from './DiamondSticker';

const FONTS = {
  serif: { fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em', textTransform: 'none' },
  sans: { fontFamily: 'var(--font-body)', letterSpacing: '0.12em', textTransform: 'uppercase' },
};

export default function Decoration({ item }) {
  const kind = item.kind || 'shape';

  const animation = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 420, damping: 22 },
  };

  if (kind === 'diamond') {
    return (
      <motion.span {...animation} className="block leading-none">
        <DiamondSticker color={item.color} size={item.size} shape={item.shape || 'diamond'} />
      </motion.span>
    );
  }

  if (kind === 'text') {
    return (
      <motion.span
        {...animation}
        className="block whitespace-pre-wrap break-words"
        style={{
          color: item.color,
          fontSize: `${item.size}px`,
          lineHeight: 1.15,
          textShadow: '0 1px 3px rgba(26,28,30,0.38), 0 0 14px rgba(255,255,255,0.55)',
          ...(FONTS[item.font] || FONTS.serif),
        }}
      >
        {item.text}
      </motion.span>
    );
  }

  return (
    <motion.span
      {...animation}
      className="block leading-none"
      style={{
        color: item.color,
        fontSize: `${item.size}px`,
        textShadow: '0 1px 3px rgba(26,28,30,0.28), 0 0 10px rgba(255,255,255,0.45)',
      }}
    >
      {item.glyph}
    </motion.span>
  );
}