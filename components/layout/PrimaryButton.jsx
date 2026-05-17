import { Button } from '@/components/ui/button'
import { classNames } from '@/utils/classNames'

export function PrimaryButton({ children, onClick, className = '', variant = 'blue', type = 'button' }) {
  const styles = {
    blue: { variant: 'default', className: 'bg-main text-mtext' },
    green: { variant: 'reverse', className: 'bg-avuc-lightGreen text-avuc-text' },
    light: { variant: 'neutral', className: 'bg-bw text-text' },
    danger: { variant: 'reverse', className: 'bg-avuc-red text-white' },
  }
  const buttonStyle = styles[variant] || styles.blue

  return (
    <Button
      type={type}
      onClick={onClick}
      variant={buttonStyle.variant}
      className={classNames(
        'min-h-12 rounded-2xl px-5 py-3 font-heading',
        buttonStyle.className,
        className,
      )}
    >
      {children}
    </Button>
  )
}
