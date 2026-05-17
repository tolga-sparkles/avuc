import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export function FloatingEmergencyButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="reverse"
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-40 gap-2 rounded-[1.25rem] bg-red-500/90 px-4 py-3 text-xs font-bold text-white shadow-[0_4px_16px_rgba(239,68,68,0.25)] backdrop-blur-sm transition-all hover:bg-red-500 hover:shadow-[0_6px_20px_rgba(239,68,68,0.35)] lg:bottom-6 lg:right-6"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <AlertTriangle className="h-3.5 w-3.5" />
      Acil
    </Button>
  )
}
