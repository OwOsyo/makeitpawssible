export default function DiamondSticker({ color = '#C98B2E', size = 30, shape = 'diamond' }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 40 46"
      aria-hidden="true"
      className="block"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(26,28,30,0.35))' }}
    >
      {shape === 'star' && (
        <>
          <g paintOrder="stroke" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round">
            <path
              d="M20 5 L24.5 16.9 L37.1 17.4 L27.2 25.4 L30.6 37.6 L20 30.6 L9.4 37.6 L12.8 25.4 L2.9 17.4 L15.5 16.9 Z"
              fill={color}
            />
            <path d="M20 5 L24.5 16.9 L20 21 Z" fill="#ffffff" opacity="0.28" stroke="none" />
          </g>
          <path
            d="M31 2 l0.9 2.4 2.4 0.9 -2.4 0.9 -0.9 2.4 -0.9 -2.4 -2.4 -0.9 2.4 -0.9 z"
            fill="#ffffff"
            opacity="0.95"
          />
        </>
      )}

      {shape === 'heart' && (
        <>
          <g paintOrder="stroke" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round">
            <path
              d="M20 41 C 9 31, 4 24, 4 16.5 C 4 10.5, 8.6 6.5, 13.4 6.5 C 16.9 6.5, 19.1 8.6, 20 11 C 20.9 8.6, 23.1 6.5, 26.6 6.5 C 31.4 6.5, 36 10.5, 36 16.5 C 36 24, 31 31, 20 41 Z"
              fill={color}
            />
            <ellipse
              cx="13"
              cy="14"
              rx="3.4"
              ry="2.4"
              fill="#ffffff"
              opacity="0.32"
              stroke="none"
              transform="rotate(-25 13 14)"
            />
          </g>
          <path
            d="M33 3 l0.9 2.4 2.4 0.9 -2.4 0.9 -0.9 2.4 -0.9 -2.4 -2.4 -0.9 2.4 -0.9 z"
            fill="#ffffff"
            opacity="0.95"
          />
        </>
      )}

      {shape === 'flower' && (
        <>
          <g paintOrder="stroke" stroke="#ffffff" strokeWidth="2.2">
            <circle cx="20" cy="15" r="7" fill={color} />
            <circle cx="27.8" cy="19.5" r="7" fill={color} />
            <circle cx="27.8" cy="28.5" r="7" fill={color} />
            <circle cx="20" cy="33" r="7" fill={color} />
            <circle cx="12.2" cy="28.5" r="7" fill={color} />
            <circle cx="12.2" cy="19.5" r="7" fill={color} />
            <circle cx="20" cy="24" r="5.4" fill="#ffffff" opacity="0.9" stroke="none" />
          </g>
          <path
            d="M31 2 l0.9 2.4 2.4 0.9 -2.4 0.9 -0.9 2.4 -0.9 -2.4 -2.4 -0.9 2.4 -0.9 z"
            fill="#ffffff"
            opacity="0.95"
          />
        </>
      )}

      {shape === 'round' && (
        <>
          <g paintOrder="stroke" stroke="#ffffff" strokeWidth="2.2">
            <circle cx="20" cy="24" r="17" fill={color} />
            <path d="M20 24 L20 9 A15 15 0 0 0 7 16.5 Z" fill="#ffffff" opacity="0.24" stroke="none" />
            <path d="M20 24 L31.5 33.5 A15 15 0 0 1 20 39 Z" fill="#000000" opacity="0.1" stroke="none" />
          </g>
          <circle cx="20" cy="24" r="9" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.9" fill="none" />
          <path
            d="M32 4.5 l0.9 2.4 2.4 0.9 -2.4 0.9 -0.9 2.4 -0.9 -2.4 -2.4 -0.9 2.4 -0.9 z"
            fill="#ffffff"
            opacity="0.95"
          />
        </>
      )}

      {(!shape || shape === 'diamond') && (
        <>
          <g paintOrder="stroke" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round">
            <path d="M20 44 L4 18 L11 5 H29 L36 18 Z" fill={color} />
            <path d="M11 5 L15 18 L20 44 L4 18 Z" fill="#ffffff" opacity="0.24" stroke="none" />
            <path d="M29 5 L25 18 L20 44 L36 18 Z" fill="#000000" opacity="0.12" stroke="none" />
            <path d="M11 5 H29 L25 18 H15 Z" fill="#ffffff" opacity="0.42" stroke="none" />
          </g>
          <g stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.9" fill="none">
            <path d="M11 5 L29 5" />
            <path d="M15 18 H25" />
            <path d="M4 18 H36" />
          </g>
          <path
            d="M32.5 1.5 l1.1 2.9 2.9 1.1 -2.9 1.1 -1.1 2.9 -1.1 -2.9 -2.9 -1.1 2.9 -1.1 z"
            fill="#ffffff"
            opacity="0.95"
          />
        </>
      )}
    </svg>
  );
}