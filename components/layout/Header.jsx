import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Home, Shield, CloudRain, Radio, Map, PackagePlus, HandCoins, AlertOctagon, LogIn, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { classNames } from '@/utils/classNames'

const navItems = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'reports', label: 'İhbarlar', icon: AlertOctagon },
  { id: 'prep', label: 'Hazırlık', icon: Shield },
  { id: 'weather', label: 'Hava', icon: CloudRain },
  { id: 'map', label: 'Harita', icon: Map },
  { id: 'radio', label: 'Radyo', icon: Radio },
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
                isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50',
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
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

  const goTo = (page) => {
    setOpen(false)
    onNavigate(page)
  }

  return (
    <header className="sticky top-2 z-50 px-3 sm:px-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-2.5 shadow-[0_2px_16px_rgba(15,23,42,0.05)] backdrop-blur-md">
        {/* Logo */}
        <button
          onClick={() => goTo('home')}
          className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
          aria-label="avuc ana sayfa"
        >
          <img src="/avuc-logo.svg" alt="avuc" className="h-9 w-auto object-contain" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={classNames(
                  'relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
                  isActive
                    ? item.primary
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-900'
                    : item.primary
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
                {isActive && !item.primary && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-slate-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* Right side: User actions */}
        <div className="hidden items-center gap-1 lg:flex">
          {isAdmin && (
            <button
              onClick={() => goTo('admin')}
              className={classNames(
                'rounded-xl px-3.5 py-2.5 text-sm font-semibold transition',
                activePage === 'admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
              )}
            >
              Admin
            </button>
          )}

          <div className="mx-1.5 h-5 w-px bg-slate-200" />

          {isLoggedIn ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo('profile')}
                className={classNames(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition',
                  activePage === 'profile' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                )}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user?.name || 'Profil'}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                title="Çıkış yap"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" />
              Giriş
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown — sadece bottom nav'da olmayan sayfalar */}
      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-md rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden"
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
            { id: 'radio', label: 'Acil Radyo', icon: Radio },
          ]} activePage={activePage} onNavigate={goTo} />

          {isAdmin && (
            <div className="mt-2 border-t border-slate-100 pt-2">
              <button
                onClick={() => goTo('admin')}
                className={classNames(
                  'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  activePage === 'admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50',
                )}
              >
                <User className="h-4 w-4" />
                Admin Paneli
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
