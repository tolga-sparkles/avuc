export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-avuc-blue">{eyebrow}</p> : null}
        <h2 className="text-2xl font-black tracking-tight text-avuc-text sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-xl text-sm leading-6 text-avuc-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
