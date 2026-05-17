export function SeismographLine() {
  return (
    <div className="relative h-12 w-full overflow-hidden rounded-xl bg-slate-900">
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="seismoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="1" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#seismoGrad)"
          strokeWidth="2"
          points="0,24 30,18 60,28 90,20 120,26 150,22 180,30 210,24 240,20 270,28 300,24 330,18 360,26 390,22 420,24 450,20 480,28 510,24 540,18 570,26 600,24"
          style={{ animation: 'seismograph 2s linear infinite' }}
        />
      </svg>
      <div className="absolute left-2 top-1 text-[10px] font-mono font-bold text-green-400">SISMOGRAF: AKTIF</div>
    </div>
  )
}
