const patterns = [
  // 0: Circuit nodes
  (
    <g key="circuit" stroke="currentColor" strokeWidth="1" fill="none">
      <circle cx="60" cy="40" r="4" />
      <circle cx="140" cy="80" r="4" />
      <circle cx="100" cy="120" r="4" />
      <circle cx="200" cy="50" r="3" />
      <circle cx="260" cy="110" r="4" />
      <circle cx="320" cy="60" r="3" />
      <line x1="64" y1="42" x2="136" y2="78" />
      <line x1="144" y1="82" x2="200" y2="52" />
      <line x1="104" y1="118" x2="140" y2="82" />
      <line x1="203" y1="50" x2="256" y2="108" />
      <line x1="264" y1="108" x2="317" y2="62" />
      <line x1="60" y1="44" x2="60" y2="80" strokeDasharray="3 4" opacity="0.4" />
      <line x1="320" y1="63" x2="320" y2="100" strokeDasharray="3 4" opacity="0.4" />
    </g>
  ),
  // 1: Topographic curves
  (
    <g key="topo" stroke="currentColor" strokeWidth="1" fill="none">
      <path d="M20,100 Q100,20 200,80 T380,60" opacity="0.6" />
      <path d="M20,120 Q120,50 220,100 T380,80" opacity="0.4" />
      <path d="M20,140 Q140,80 240,120 T380,100" opacity="0.25" />
      <path d="M20,80 Q80,10 180,60 T380,40" opacity="0.3" />
      <circle cx="200" cy="80" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="100" cy="60" r="1.5" fill="currentColor" opacity="0.4" />
    </g>
  ),
  // 2: Diagonal grid
  (
    <g key="diag" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.3">
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`d${i}`} x1={i * 40 - 80} y1="0" x2={i * 40 + 80} y2="160" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`r${i}`} x1={i * 40 + 80} y1="0" x2={i * 40 - 80} y2="160" />
      ))}
      <circle cx="180" cy="80" r="20" strokeWidth="1.5" opacity="1" />
      <circle cx="180" cy="80" r="6" strokeWidth="1.5" opacity="1" />
    </g>
  ),
  // 3: Waveform
  (
    <g key="wave" stroke="currentColor" strokeWidth="1" fill="none">
      <path d="M0,80 Q45,30 90,80 T180,80 T270,80 T360,80" opacity="0.5" />
      <path d="M0,80 Q45,50 90,80 T180,80 T270,80 T360,80" opacity="0.3" />
      <path d="M0,80 Q45,110 90,80 T180,80 T270,80 T360,80" opacity="0.3" />
      <path d="M0,80 Q45,130 90,80 T180,80 T270,80 T360,80" opacity="0.5" />
      {[90, 180, 270].map((x) => (
        <circle key={x} cx={x} cy="80" r="2" fill="currentColor" opacity="0.4" />
      ))}
    </g>
  ),
  // 4: Stacked layers
  (
    <g key="layers" stroke="currentColor" strokeWidth="1" fill="none">
      <rect x="100" y="30" width="180" height="100" rx="4" opacity="0.15" />
      <rect x="115" y="40" width="180" height="100" rx="4" opacity="0.25" />
      <rect x="130" y="50" width="180" height="100" rx="4" opacity="0.4" />
      <line x1="150" y1="75" x2="280" y2="75" opacity="0.3" />
      <line x1="150" y1="90" x2="260" y2="90" opacity="0.2" />
      <line x1="150" y1="105" x2="240" y2="105" opacity="0.15" />
    </g>
  ),
  // 5: Hexagonal mesh
  (
    <g key="hex" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.35">
      {[0, 1, 2, 3, 4].map((col) =>
        [0, 1, 2].map((row) => {
          const x = 80 + col * 52 + (row % 2) * 26;
          const y = 20 + row * 48;
          const s = 16;
          return (
            <polygon
              key={`${col}-${row}`}
              points={`${x},${y - s} ${x + s * 0.87},${y - s / 2} ${x + s * 0.87},${y + s / 2} ${x},${y + s} ${x - s * 0.87},${y + s / 2} ${x - s * 0.87},${y - s / 2}`}
            />
          );
        }),
      )}
      <circle cx="190" cy="68" r="8" strokeWidth="1.5" opacity="1" />
    </g>
  ),
  // 6: Converging lines
  (
    <g key="converge" stroke="currentColor" strokeWidth="0.75" fill="none">
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1={i * 30}
          y1="0"
          x2="190"
          y2="80"
          opacity={0.15 + Math.abs(7 - i) * 0.03}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={`b${i}`}
          x1={i * 30}
          y1="160"
          x2="190"
          y2="80"
          opacity={0.15 + Math.abs(7 - i) * 0.03}
        />
      ))}
      <circle cx="190" cy="80" r="4" fill="currentColor" opacity="0.5" />
    </g>
  ),
  // 7: Dot matrix with path
  (
    <g key="dots" fill="currentColor" stroke="currentColor">
      {Array.from({ length: 8 }, (_, col) =>
        Array.from({ length: 4 }, (_, row) => (
          <circle
            key={`${col}-${row}`}
            cx={60 + col * 38}
            cy={25 + row * 38}
            r="1.5"
            opacity="0.2"
          />
        )),
      )}
      <path
        d="M60,63 C120,25 200,120 340,63"
        fill="none"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle cx="60" cy="63" r="3" opacity="0.5" />
      <circle cx="340" cy="63" r="3" opacity="0.5" />
    </g>
  ),
];

export function ProjectPattern({
  index,
  gradient,
}: {
  index: number;
  gradient: string;
}) {
  const pattern = patterns[index % patterns.length];

  return (
    <div
      className={`relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br ${gradient}`}
    >
      <svg
        viewBox="0 0 380 160"
        className="h-full w-full text-accent/30"
        preserveAspectRatio="xMidYMid slice"
      >
        {pattern}
      </svg>
    </div>
  );
}
