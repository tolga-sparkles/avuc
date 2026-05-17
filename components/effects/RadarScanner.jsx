export function RadarScanner() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-200 bg-slate-50 shadow-inner">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.5) 60deg, transparent 90deg)',
          animation: 'spin 2s linear infinite',
        }}
      />
      <div className="relative z-10 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
      <div className="absolute inset-0 rounded-full border border-slate-100 opacity-50" style={{ transform: 'scale(0.6)' }} />
      <div className="absolute inset-0 rounded-full border border-slate-100 opacity-30" style={{ transform: 'scale(0.3)' }} />
    </div>
  )
}
