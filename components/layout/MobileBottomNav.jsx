import { classNames } from '@/utils/classNames'
import { Home, AlertOctagon, PlusCircle, HandCoins, User } from 'lucide-react'

const navItems = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'reports', label: 'İhbarlar', icon: AlertOctagon },
  { id: 'create', label: 'İlan Ver', icon: PlusCircle, primary: true },
  { id: 'donations', label: 'Bağış', icon: HandCoins },
  { id: 'profile', label: 'Profil', icon: User },
]

export function MobileBottomNav({ activePage, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/70 bg-white/90 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-lg lg:hidden" aria-label="Mobil alt menü">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={classNames(
                'flex h-auto min-h-12 flex-col items-center justify-center rounded-2xl px-2 py-1.5 text-center text-[11px] font-bold transition-all duration-150 active:scale-95',
                item.primary
                  ? isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-orange-500 hover:bg-orange-50'
                  : isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600',
              )}
            >
              <Icon className={classNames('mb-0.5 h-5 w-5', item.primary && isActive ? 'text-white' : '')} />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
