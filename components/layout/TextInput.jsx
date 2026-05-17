import { classNames } from '@/utils/classNames'

export function TextInput({ label, as = 'input', children, className = '', ...props }) {
  const Component = as
  return (
    <label className={classNames('block', className)}>
      <span className="mb-2 block text-sm font-semibold text-avuc-text">{label}</span>
      <Component
        className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
        {...props}
      >
        {children}
      </Component>
    </label>
  )
}
