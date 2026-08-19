export function PcbBackground({ dense = false }: { dense?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-neon)", opacity: dense ? 0.22 : 0.14 }}
      />
      <div
        className="absolute bottom-[-12rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "var(--violet)", opacity: 0.18 }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="trace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.16 200)" />
            <stop offset="100%" stopColor="oklch(0.55 0.24 297)" />
          </linearGradient>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M60 0H0V60"
              fill="none"
              stroke="oklch(0.85 0.16 200)"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1200" height="900" fill="url(#grid)" />
        <g fill="none" stroke="url(#trace)" strokeWidth="1.6" strokeOpacity="0.55">
          <path className="trace-anim" d="M0 140 H240 L300 200 H520 L580 140 H900 L960 200 H1200" />
          <path className="trace-anim" d="M0 420 H180 L260 340 H460 L540 420 H760 L840 340 H1200" />
          <path className="trace-anim" d="M0 700 H300 L370 640 H620 L700 720 H1000 L1060 660 H1200" />
          <path className="trace-anim" d="M160 900 V640 L240 560 V300 L180 240 V0" />
          <path className="trace-anim" d="M880 900 V700 L960 620 V360 L900 300 V0" />
          <path className="trace-anim" d="M520 900 V760 L600 690 V520" />
        </g>
        <g fill="oklch(0.85 0.16 200)">
          {[
            [240, 140],
            [580, 140],
            [960, 200],
            [260, 340],
            [540, 420],
            [840, 340],
            [370, 640],
            [700, 720],
            [1060, 660],
            [600, 690],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} className="node-pulse" cx={cx} cy={cy} r="4" />
          ))}
        </g>
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 30%, oklch(0.17 0.021 265 / 85%) 100%)",
        }}
      />
    </div>
  );
}