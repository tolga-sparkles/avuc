export function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed left-1/2 top-20 z-[85] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-avuc-line bg-white px-4 py-3 text-sm font-bold text-avuc-text shadow-soft">
      {message}
    </div>
  )
}
