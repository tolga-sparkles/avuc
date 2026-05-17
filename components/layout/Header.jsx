import { useState, useEffect } from 'react'
import { Home, Shield, CloudRain, Map, PackagePlus, HandCoins, AlertOctagon, LogIn, LogOut, User, Menu, X, Siren } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { classNames } from '@/utils/classNames'

const navItems = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'reports', label: 'İhbarlar', icon: AlertOctagon },
  { id: 'prep', label: 'Hazırlık', icon: Shield },
  { id: 'weather', label: 'Hava', icon: CloudRain },
  { id: 'emergency', label: 'Acil', icon: Siren },
  { id: 'map', label: 'Harita', icon: Map },
  { id: 'donations', label: 'Bağış', icon: HandCoins },
  { id: 'create', label: 'İlan Ver', icon: PackagePlus, primary: true },
]

function MenuGroup({ title, items, activePage, onNavigate }) {
  return (
    <div className="mb-2">
      <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
      <div className="grid grid-cols-2 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={classNames(
                'flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition active:scale-95',
                isActive ? 'bg-[#dbeafe] text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-white/55',
              )}
            >
              {Icon && <Icon className={classNames('h-3.5 w-3.5 shrink-0', isActive ? 'text-blue-600' : 'text-slate-500')} strokeWidth={2.2} />}
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Header({ activePage, onNavigate, onLogin, user, isLoggedIn, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (page) => {
    setOpen(false)
    onNavigate(page)
  }

  return (
    <header className="fixed left-0 right-0 top-3 z-50 px-3 sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        {/* Logo — separate glass box */}
        <button
          onClick={() => goTo('home')}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white/35 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition hover:bg-white/60 sm:h-16 sm:w-16"
          aria-label="avuc ana sayfa"
        >
          <img src="/avuc-logo.svg" alt="avuc" className="h-10 w-auto object-contain sm:h-12" />
        </button>

        {/* Desktop Navigation — glass bar */}
        <nav className={classNames(
          'hidden min-h-[3.5rem] flex-1 items-center justify-between rounded-[18px] px-3 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition-all duration-300 lg:flex',
          scrolled ? 'bg-white/60 border border-white/45' : 'bg-white/35 border border-white/30',
        )}>
          <div className="flex items-center">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={classNames(
                    'relative inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-sm font-medium tracking-[-0.03em] text-slate-950 whitespace-nowrap transition-all duration-200',
                    isActive
                      ? 'bg-[#dbeafe] font-semibold shadow-sm'
                      : 'hover:bg-white/45 hover:text-slate-700',
                  )}
                >
                  {Icon && <Icon className={classNames('h-3.5 w-3.5 shrink-0', isActive ? 'text-blue-600' : 'text-slate-500')} strokeWidth={2.2} />}
                  <span>{item.label}</span>
                </button>
              )
            })}

            {isAdmin && (
              <button
                onClick={() => goTo('admin')}
                className={classNames(
                  'inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-sm font-medium tracking-[-0.03em] text-slate-950 whitespace-nowrap transition-all duration-200',
                  activePage === 'admin' ? 'bg-[#dbeafe] font-semibold shadow-sm' : 'hover:bg-white/45 hover:text-slate-700',
                )}
              >
                <User className={classNames('h-3.5 w-3.5 shrink-0', activePage === 'admin' ? 'text-blue-600' : 'text-slate-500')} strokeWidth={2.2} />
                Panel
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-200/60">
            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goTo('profile')}
                  className={classNames(
                    'inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-sm font-medium tracking-[-0.03em] text-slate-950 whitespace-nowrap transition-all duration-200',
                    activePage === 'profile' ? 'bg-[#dbeafe] font-semibold shadow-sm' : 'hover:bg-white/45 hover:text-slate-700',
                  )}
                >
                  <User className={classNames('h-3.5 w-3.5 shrink-0', activePage === 'profile' ? 'text-blue-600' : 'text-slate-500')} strokeWidth={2.2} />
                  <span className="max-w-[80px] truncate">{user?.name || 'Profil'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-white/45 hover:text-slate-800"
                  title="Çıkış yap"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#dbeafe] px-3.5 py-2 text-sm font-semibold tracking-[-0.03em] text-slate-950 shadow-sm whitespace-nowrap transition hover:bg-blue-100"
              >
                <LogIn className="h-3.5 w-3.5 text-blue-600" strokeWidth={2.2} />
                Giriş Yap
              </button>
            )}
          </div>
        </nav>

        {/* Mobile hamburger — glass box */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/35 text-slate-500 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition hover:bg-white/60 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-h-[calc(100vh-5rem)] max-w-md overflow-y-auto rounded-[18px] border border-white/45 bg-white/45 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl lg:hidden"
        >
          <MenuGroup title="Yardım" items={[
            { id: 'emergency', label: 'Acil Durum', icon: Siren },
            { id: 'shelter', label: 'Barınma', icon: Home },
            { id: 'match', label: 'Eşleştirme', icon: Map },
            { id: 'volunteer', label: 'Gönüllü', icon: User },
          ]} activePage={activePage} onNavigate={goTo} />

          <MenuGroup title="Keşfet" items={[
            { id: 'map', label: 'Afet Haritası', icon: Map },
            { id: 'prep', label: 'Hazırlık', icon: Shield },
            { id: 'weather', label: 'Hava Durumu', icon: CloudRain },
          ]} activePage={activePage} onNavigate={goTo} />

          {isAdmin && (
            <div className="mt-2 border-t border-white/30 pt-2">
              <button
                onClick={() => goTo('admin')}
                className={classNames(
                  'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  activePage === 'admin' ? 'bg-[#dbeafe] text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-white/55',
                )}
              >
                <User className={classNames('h-4 w-4', activePage === 'admin' ? 'text-blue-600' : 'text-slate-500')} strokeWidth={2.2} />
                Admin Paneli
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
