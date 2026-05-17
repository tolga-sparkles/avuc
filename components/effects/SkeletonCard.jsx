export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-[2rem] border border-avuc-line bg-white p-5">
          <div className="h-5 w-1/3 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
          <div className="mt-4 grid gap-2">
            <div className="h-10 rounded-xl bg-slate-200" />
            <div className="h-10 rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </>
  )
}
