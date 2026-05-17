export function LoadingBar({ active }) {
  if (!active) return null
  return <div className="fixed left-0 top-0 z-[80] h-1 w-full overflow-hidden bg-avuc-lightBlue"><div className="shimmer relative h-full w-1/2 bg-avuc-blue" /></div>
}
