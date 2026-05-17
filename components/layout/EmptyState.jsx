export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-avuc-line bg-white p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-avuc-lightBlue text-xl font-black text-avuc-blue">av</div>
      <h3 className="text-lg font-bold text-avuc-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-avuc-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
