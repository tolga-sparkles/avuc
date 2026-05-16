import { startTransition, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MenuBar } from '@/components/ui/glow-menu'
import { Component as InfiniteGridBackground } from '@/components/ui/the-infinite-grid'
import { AnimatedRoadmap } from '@/components/ui/hero-section-5'
import { Gift, HandHeart, Home, Map, PackagePlus, Route } from 'lucide-react'
import {
  adminData,
  aidListings,
  cities,
  disasterZones,
  donationPackages,
  mapPoints,
  mobileNavItems,
  profileData,
  shelterListings,
  urgentNeeds,
  volunteerTasks,
} from './data'

const aidTypes = [
  'Aracım var, yardım taşıyabilirim',
  'Erzağım var, araç arıyorum',
  'Depom var, yardımlar burada toplanabilir',
  'Gönüllüyüm, dağıtıma katılabilirim',
  'Yardım götürmek istiyorum ama ekip arıyorum',
  'Yardım bölgesinde ihtiyaç bildiriyorum',
]

const createCategories = [
  'Kalacak yer sunuyorum',
  'Kalacak yer arıyorum',
  'Aracım var',
  'Erzağım var',
  'Depom var',
  'Gönüllüyüm',
  'Acil ihtiyaç bildiriyorum',
]

const desktopLeftNav = [
  {
    id: 'home',
    label: 'Ana Sayfa',
    icon: Home,
    href: '#home',
    gradient: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(37,99,235,0.08) 50%, rgba(29,78,216,0) 100%)',
    iconColor: 'text-blue-500',
  },
  {
    id: 'shelter',
    label: 'Barınma',
    icon: HandHeart,
    href: '#shelter',
    gradient: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.07) 50%, rgba(21,128,61,0) 100%)',
    iconColor: 'text-green-500',
  },
  {
    id: 'match',
    label: 'Eşleştir',
    icon: Route,
    href: '#match',
    gradient: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(2,132,199,0.07) 50%, rgba(3,105,161,0) 100%)',
    iconColor: 'text-sky-500',
  },
]

const desktopRightNav = [
  {
    id: 'donations',
    label: 'Bağış',
    icon: Gift,
    href: '#donations',
    gradient: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)',
    iconColor: 'text-orange-500',
  },
  {
    id: 'map',
    label: 'Harita',
    icon: Map,
    href: '#map',
    gradient: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)',
    iconColor: 'text-purple-500',
  },
  {
    id: 'create',
    label: 'İlan Ver',
    icon: PackagePlus,
    href: '#create',
    gradient: 'radial-gradient(circle, rgba(239,68,68,0.16) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)',
    iconColor: 'text-red-500',
    featured: true,
  },
]

const mobileMenuItems = [
  ...desktopLeftNav,
  ...desktopRightNav,
  { id: 'volunteer', label: 'Gönüllü' },
  { id: 'profile', label: 'Profil' },
  { id: 'admin', label: 'Admin' },
]

const heroMilestones = [
  {
    id: 1,
    name: 'İhtiyaç',
    status: 'complete',
    position: { top: '74%', left: '4%' },
  },
  {
    id: 2,
    name: 'Doğrulama',
    status: 'complete',
    position: { top: '14%', left: '18%' },
  },
  {
    id: 3,
    name: 'Eşleşme',
    status: 'in-progress',
    position: { top: '45%', left: '54%' },
  },
  {
    id: 4,
    name: 'Teslim',
    status: 'pending',
    position: { top: '10%', right: '5%' },
  },
]

const heroMapImage = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80'

const pageTitles = {
  home: 'Ana Sayfa',
  shelter: 'Barınma İlanları',
  host: 'Evimi Açmak İstiyorum',
  match: 'Yardım Eşleştirme',
  donations: 'Bağış Yap',
  map: 'Afet Haritası',
  urgent: 'Acil İhtiyaç Panosu',
  volunteer: 'Gönüllü Görevleri',
  create: 'İlan Oluştur',
  profile: 'Profil',
  admin: 'Admin Paneli',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function getStatusClass(status) {
  if (status === 'Acil') return 'bg-avuc-lightRed text-avuc-red border-avuc-red/20'
  if (status === 'Yardım yolda') return 'bg-avuc-lightOrange text-amber-700 border-amber-200'
  if (status === 'Tamamlandı') return 'bg-avuc-lightGreen text-avuc-success border-avuc-success/20'
  if (status === 'Eşleşti') return 'bg-avuc-lightBlue text-avuc-darkBlue border-avuc-blue/20'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

function getUrgencyClass(level) {
  if (level === 'Acil') return 'bg-avuc-lightRed text-avuc-red'
  if (level === 'Yüksek') return 'bg-avuc-lightOrange text-amber-700'
  return 'bg-avuc-lightGreen text-avuc-success'
}

function cityFromLocation(location) {
  return location.split('/')[0].split('-')[0].trim()
}

function SectionHeader({ eyebrow, title, description, action }) {
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

function Badge({ children, className = '' }) {
  return <span className={classNames('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)}>{children}</span>
}

function PrimaryButton({ children, onClick, className = '', variant = 'blue', type = 'button' }) {
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

function TextInput({ label, as = 'input', children, className = '', ...props }) {
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

function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-avuc-line bg-white p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-avuc-lightBlue text-xl font-black text-avuc-blue">av</div>
      <h3 className="text-lg font-bold text-avuc-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-avuc-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

function LoadingBar({ active }) {
  if (!active) return null
  return <div className="fixed left-0 top-0 z-[80] h-1 w-full overflow-hidden bg-avuc-lightBlue"><div className="shimmer relative h-full w-1/2 bg-avuc-blue" /></div>
}

function Header({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false)
  const desktopMenuItems = [...desktopLeftNav, ...desktopRightNav]
  const activeMenuItem = desktopMenuItems.find((item) => item.id === activePage)?.label

  const goTo = (page) => {
    setOpen(false)
    onNavigate(page)
  }

  const handleDesktopMenuClick = (label) => {
    const item = desktopMenuItems.find((menuItem) => menuItem.label === label)
    if (item) goTo(item.id)
  }

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center rounded-[2rem] bg-white/35 px-4 py-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:px-5">
        <div className="hidden w-full justify-end pr-5 lg:flex xl:pr-8">
          <MenuBar
            items={desktopLeftNav}
            activeItem={activeMenuItem}
            onItemClick={handleDesktopMenuClick}
          />
        </div>

        <Button
          onClick={() => goTo('home')}
          variant="noShadow"
          className="group h-auto justify-self-center rounded-full !border-0 !bg-transparent p-0 shadow-none hover:translate-x-0 hover:translate-y-0"
          aria-label="avuc ana sayfa"
        >
          <img src="/avuc-logo.svg" alt="avuc" className="h-16 w-auto object-contain sm:h-[76px] lg:h-[86px]" />
        </Button>

        <div className="hidden w-full justify-start pl-5 lg:flex xl:pl-8">
          <MenuBar
            items={desktopRightNav}
            activeItem={activeMenuItem}
            onItemClick={handleDesktopMenuClick}
          />
        </div>

        <Button
          onClick={() => setOpen((value) => !value)}
          variant="neutral"
          className="justify-self-end rounded-2xl px-4 text-sm font-heading lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menü
        </Button>
      </div>

      {open ? (
        <div id="mobile-menu" className="mx-auto mt-2 max-w-md rounded-[1.35rem] border border-border bg-bw/95 p-3 shadow-shadow backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {mobileMenuItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => goTo(item.id)}
                variant={activePage === item.id ? 'default' : 'neutral'}
                className={classNames(
                  'justify-start rounded-2xl px-4 py-3 text-left text-sm font-heading',
                  activePage === item.id ? 'bg-main text-mtext' : 'bg-bw text-text',
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}

function MobileBottomNav({ activePage, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bw/95 px-2 pb-2 pt-2 shadow-shadow backdrop-blur-xl lg:hidden" aria-label="Mobil alt menü">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileNavItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            variant={activePage === item.id ? 'default' : 'neutral'}
            className={classNames(
              'h-auto min-h-12 flex-col rounded-2xl px-2 py-2 text-center text-[11px] font-heading',
              activePage === item.id ? 'bg-main text-mtext' : 'bg-bw text-text',
            )}
          >
            <span className="mx-auto mb-1 block h-1.5 w-1.5 rounded-full bg-current" />
            {item.short}
          </Button>
        ))}
      </div>
    </nav>
  )
}

function FloatingEmergencyButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="reverse"
      className="fixed bottom-24 right-4 z-40 rounded-2xl bg-avuc-red px-5 py-4 text-sm font-heading text-white lg:bottom-6 lg:right-6"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      Acil Yardım Bildir
    </Button>
  )
}

function EmergencyModal({ open, onClose, onSubmit }) {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) setSent(false)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl animate-slide-up rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="border-avuc-red/20 bg-avuc-lightRed text-avuc-red">Acil durum</Badge>
            <h2 className="mt-3 text-2xl font-black text-avuc-text">Acil yardım bildirimi</h2>
            <p className="mt-2 text-sm leading-6 text-avuc-muted">Konum ve ihtiyacı kısa yazın. Bildirim admin onayına düşer ve en yakın gönüllülere önerilir.</p>
          </div>
          <Button onClick={onClose} variant="neutral" size="sm" className="rounded-2xl font-heading">Kapat</Button>
        </div>

        {sent ? (
          <div className="mt-6 rounded-3xl bg-avuc-lightGreen p-5 text-avuc-success">
            <p className="font-black">Bildirim alındı.</p>
            <p className="mt-1 text-sm">Koordinasyon ekibi onayladıktan sonra ihtiyaç panosuna düşecek.</p>
          </div>
        ) : (
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setSent(true)
              onSubmit('Acil yardım bildirimi alındı')
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Şehir" placeholder="Hatay" required />
              <TextInput label="İlçe / mahalle" placeholder="Antakya" required />
            </div>
            <TextInput label="İhtiyaç türü" as="select" defaultValue="Sıcak yemek" required>
              <option>Sıcak yemek</option>
              <option>Kalacak yer</option>
              <option>Araç desteği</option>
              <option>Bebek ürünü</option>
              <option>Hijyen</option>
            </TextInput>
            <TextInput label="Kısa açıklama" as="textarea" rows="4" placeholder="20 kişilik sıcak yemek ve içme suyu gerekiyor." required />
            <PrimaryButton type="submit" variant="danger" className="w-full">Bildirimi gönder</PrimaryButton>
          </form>
        )}
      </div>
    </div>
  )
}

function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed left-1/2 top-20 z-[85] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-avuc-line bg-white px-4 py-3 text-sm font-bold text-avuc-text shadow-soft">
      {message}
    </div>
  )
}

function HomePage({ onNavigate }) {
  return (
    <div className="space-y-12 pb-20">
      <section className="relative -mt-16 overflow-hidden rounded-b-[2.5rem] bg-transparent pt-16">
        <div className="absolute left-8 top-10 h-32 w-32 rounded-full bg-avuc-lightBlue blur-2xl" />
        <div className="absolute bottom-10 right-12 h-40 w-40 rounded-full bg-avuc-lightGreen blur-2xl" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="relative z-10 flex flex-col justify-center">
            <Badge className="w-fit border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">Koordinasyon ağı</Badge>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-avuc-text sm:text-5xl lg:text-6xl">
              Afet Anında Yardımı Doğru Kişiye Ulaştır
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-avuc-muted">
              Barınma, lojistik ve bağışı tek akışta eşleştirir.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <PrimaryButton onClick={() => onNavigate('shelter')} className="justify-start px-5">Kalacak Yer</PrimaryButton>
              <PrimaryButton onClick={() => onNavigate('host')} variant="green" className="justify-start px-5">Evimi Aç</PrimaryButton>
              <PrimaryButton onClick={() => onNavigate('match')} variant="light" className="justify-start px-5">Yardım Götür</PrimaryButton>
              <PrimaryButton onClick={() => onNavigate('donations')} variant="light" className="justify-start px-5">Bağış Yap</PrimaryButton>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                ['248', 'Aktif ilan'],
                ['71', 'Eşleşen yardım'],
                ['96%', 'Güven puanı'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-avuc-line bg-slate-50 p-4">
                  <p className="text-2xl font-black text-avuc-text">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-avuc-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-avuc-line bg-gradient-to-br from-white via-blue-50 to-green-50 shadow-soft">
            <div className="absolute right-8 top-8 z-10 rounded-full bg-white/80 px-4 py-2 text-xs font-black text-avuc-muted shadow-sm backdrop-blur">
              Canlı akış
            </div>
            <AnimatedRoadmap
              milestones={heroMilestones}
              mapImageSrc={heroMapImage}
              className="max-w-none py-4"
              aria-label="Afet koordinasyonu için ihtiyaçtan teslimata ilerleyen animasyonlu yol haritası."
            />
            <div className="absolute bottom-6 left-6 right-6 z-10 grid grid-cols-3 gap-2">
              {[
                ['08 dk', 'Yanıt'],
                ['71', 'Eşleşme'],
                ['96%', 'Güven'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/85 p-3 text-center shadow-sm backdrop-blur">
                  <p className="text-lg font-black text-avuc-text">{value}</p>
                  <p className="text-[11px] font-bold text-avuc-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Canlı koordinasyon"
          title="Aktif afet bölgeleri"
          action={<PrimaryButton variant="light" onClick={() => onNavigate('map')}>Haritada gör</PrimaryButton>}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {disasterZones.map((zone) => (
            <article key={`${zone.city}-${zone.district}`} className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-avuc-text">{zone.city}</h3>
                  <p className="text-sm font-semibold text-avuc-muted">{zone.district}</p>
                </div>
                <Badge className={getUrgencyClass(zone.level)}>{zone.level}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {zone.needs.map((need) => <Badge key={need} className="border-avuc-line bg-slate-50 text-avuc-muted">{need}</Badge>)}
              </div>
              <p className="mt-4 text-xs font-semibold text-avuc-muted">Son güncelleme: {zone.updated}</p>
            </article>
          ))}
        </div>
      </section>

      <UrgentNeedsSection onNavigate={onNavigate} limit={4} />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SummaryCard
          title="Barınma"
          stats={[['4', 'örnek ilan'], ['14 gün', 'en uzun süre'], ['3', 'doğrulanmış ilan']]}
          action={<PrimaryButton onClick={() => onNavigate('shelter')}>Barınma ilanlarını aç</PrimaryButton>}
        />
        <SummaryCard
          title="Lojistik eşleşme"
          stats={[['6', 'aktif destek'], ['1 ton', 'taşıma kapasitesi'], ['2', 'acil eşleşme']]}
          action={<PrimaryButton variant="green" onClick={() => onNavigate('match')}>Eşleştirme yap</PrimaryButton>}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Süreç" title="Yardım nasıl çalışır?" />
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['1', 'İhtiyaç girilir'],
            ['2', 'Doğrulanır'],
            ['3', 'Eşleşir'],
            ['4', 'Teslim edilir'],
          ].map(([step, title]) => (
            <div key={step} className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-avuc-blue text-lg font-black text-white">{step}</div>
              <h3 className="mt-5 text-lg font-black text-avuc-text">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      <SecuritySection onNavigate={onNavigate} />
    </div>
  )
}

function SummaryCard({ title, description, stats, action }) {
  return (
    <article className="card-hover rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
      <h3 className="text-2xl font-black text-avuc-text">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-avuc-muted">{description}</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xl font-black text-avuc-text">{value}</p>
            <p className="mt-1 text-xs font-semibold text-avuc-muted">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">{action}</div>
    </article>
  )
}

function SecuritySection({ onNavigate }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-5 rounded-[2.25rem] border border-avuc-line bg-white p-6 shadow-soft lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <Badge className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">Güvenlik ve doğrulama</Badge>
          <h2 className="mt-4 text-3xl font-black text-avuc-text">Sahte ilan riskini azaltan güven katmanları</h2>
          <p className="mt-3 text-sm leading-6 text-avuc-muted">
            Her ilan telefon doğrulama, kimlik doğrulama, kurum onayı, kullanıcı puanı ve bildirim mekanizmalarıyla takip edilir.
          </p>
          <PrimaryButton onClick={() => onNavigate('admin')} variant="light" className="mt-6">Admin panelini gör</PrimaryButton>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Telefon doğrulama rozeti',
            'Kimlik doğrulama rozeti',
            'Kurum onaylı ilan etiketi',
            'İlanı bildir butonu',
            'Sahte ilan şikayet sistemi',
            'Admin onayı bekleyen ilan durumu',
            'Yardım tamamlandı onayı',
            'Kullanıcı puanı',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-avuc-line bg-slate-50 p-4 text-sm font-bold text-avuc-text">
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-avuc-green" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UrgentNeedsSection({ onNavigate, limit }) {
  const needs = limit ? urgentNeeds.slice(0, limit) : urgentNeeds
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Acil ihtiyaç panosu"
        title="Gerçek zamanlı ihtiyaç listesi"
        description="Acil talepler, durum etiketi ve son güncelleme bilgisiyle sahaya hızlı aksiyon sağlar."
        action={limit ? <PrimaryButton variant="light" onClick={() => onNavigate('urgent')}>Tüm ihtiyaçları gör</PrimaryButton> : null}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {needs.map((need) => (
          <article key={need.id} className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <Badge className={getStatusClass(need.status)}>{need.status}</Badge>
              <span className="text-xs font-bold text-avuc-muted">{need.updated}</span>
            </div>
            <h3 className="mt-4 text-lg font-black text-avuc-text">{need.location}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-avuc-muted">{need.need}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="border-avuc-line bg-slate-50 text-avuc-muted">{need.type}</Badge>
              <Badge className={getUrgencyClass(need.level)}>{need.level}</Badge>
              <Badge className="border-avuc-line bg-slate-50 text-avuc-muted">{need.people} kişi</Badge>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function UrgentNeedsPage({ onNavigate }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <UrgentNeedsSection onNavigate={onNavigate} />
      <div className="mt-8 rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
        <h3 className="text-xl font-black text-avuc-text">Boş durum ve güvenli bildirim</h3>
        <p className="mt-2 text-sm leading-6 text-avuc-muted">Belirli bir şehirde ihtiyaç bulunmadığında kullanıcılar tek tıkla acil yardım bildirebilir veya gönüllü ekip bekleme listesine katılabilir.</p>
      </div>
    </main>
  )
}

function ShelterPage({ onNavigate, onToast }) {
  const [filters, setFilters] = useState({ city: '', district: '', capacity: '', family: false, children: false, pets: false, disabled: false, transport: false, verified: false })

  const filteredShelters = shelterListings.filter((listing) => {
    if (filters.city && listing.city !== filters.city) return false
    if (filters.district && !listing.district.toLocaleLowerCase('tr').includes(filters.district.toLocaleLowerCase('tr'))) return false
    if (filters.capacity && listing.capacity < Number(filters.capacity)) return false
    if (filters.family && !listing.family) return false
    if (filters.children && !listing.children) return false
    if (filters.pets && !listing.pets) return false
    if (filters.disabled && !listing.disabled) return false
    if (filters.transport && !listing.transport) return false
    if (filters.verified && !listing.verified) return false
    return true
  })

  const toggle = (key) => setFilters((current) => ({ ...current, [key]: !current[key] }))

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Barınma"
        title="Barınma ilanları"
        description="Evini açan gönüllülerin kapasite, süre, aile uygunluğu ve doğrulama bilgilerini filtreleyin."
        action={<PrimaryButton onClick={() => onNavigate('host')} variant="green">Evimi Açmak İstiyorum</PrimaryButton>}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <h3 className="text-lg font-black text-avuc-text">Filtreler</h3>
          <div className="mt-5 grid gap-4">
            <TextInput label="Şehir" as="select" value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })}>
              <option value="">Tüm şehirler</option>
              {cities.map((city) => <option key={city}>{city}</option>)}
            </TextInput>
            <TextInput label="İlçe" placeholder="Şahinbey" value={filters.district} onChange={(event) => setFilters({ ...filters, district: event.target.value })} />
            <TextInput label="Kişi kapasitesi" as="select" value={filters.capacity} onChange={(event) => setFilters({ ...filters, capacity: event.target.value })}>
              <option value="">Fark etmez</option>
              <option value="2">En az 2 kişi</option>
              <option value="3">En az 3 kişi</option>
              <option value="4">En az 4 kişi</option>
              <option value="5">En az 5 kişi</option>
            </TextInput>
            <div className="grid gap-2">
              {[
                ['family', 'Aileye uygun'],
                ['children', 'Çocuklu aileye uygun'],
                ['pets', 'Evcil hayvan kabul ediyor'],
                ['disabled', 'Engelli birey için uygun'],
                ['transport', 'Ulaşım kolaylığı'],
                ['verified', 'Doğrulanmış ilanlar'],
              ].map(([key, label]) => (
                <Button
                  key={key}
                  onClick={() => toggle(key)}
                  variant={filters[key] ? 'default' : 'neutral'}
                  className={classNames(
                    'h-auto justify-between rounded-2xl px-4 py-3 text-left text-sm font-heading',
                    filters[key] ? 'bg-main text-mtext' : 'bg-bw text-text',
                  )}
                >
                  {label}
                  <span className={classNames('h-3 w-3 rounded-full', filters[key] ? 'bg-avuc-blue' : 'bg-slate-300')} />
                </Button>
              ))}
            </div>
          </div>
        </aside>

        <section>
          {filteredShelters.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredShelters.map((listing) => (
                <ShelterCard key={listing.id} listing={listing} onToast={onToast} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Bu filtrelerde ilan bulunamadı"
              description="Filtreleri genişletin veya ihtiyacı acil pano üzerinden bildirin."
              action={<PrimaryButton onClick={() => onNavigate('urgent')}>Acil ihtiyaç bildir</PrimaryButton>}
            />
          )}
        </section>
      </div>
    </main>
  )
}

function ShelterCard({ listing, onToast }) {
  return (
    <article className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-avuc-text">{listing.city} / {listing.district}</h3>
          <p className="mt-1 text-sm font-semibold text-avuc-muted">{listing.type} · {listing.capacity} kişi kalabilir · {listing.duration}</p>
        </div>
        {listing.verified ? <Badge className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">Doğrulanmış kullanıcı</Badge> : <Badge className="border-avuc-line bg-slate-50 text-avuc-muted">Admin onayı bekliyor</Badge>}
      </div>
      <p className="mt-4 text-sm leading-6 text-avuc-muted">{listing.note}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          ['Aileye uygun', listing.family],
          ['Çocuklu aile', listing.children],
          ['Evcil hayvan', listing.pets],
          ['Engelli erişimi', listing.disabled],
          ['Ulaşım', listing.transport],
          ['Kullanıcı puanı', `${listing.hostScore}/5`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-avuc-muted">
            <span className="text-avuc-text">{label}:</span> {typeof value === 'boolean' ? (value ? 'Var' : 'Yok') : value}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {listing.amenities.map((item) => <Badge key={item} className="border-avuc-line bg-white text-avuc-muted">{item}</Badge>)}
        <Badge className="border-avuc-line bg-white text-avuc-muted">{listing.gender}</Badge>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={() => onToast('İletişim talebi güvenli kanal üzerinden gönderildi')} className="flex-1">İletişime geç</PrimaryButton>
        <PrimaryButton onClick={() => onToast('İlan bildirimi admin paneline iletildi')} variant="light" className="flex-1">İlanı bildir</PrimaryButton>
      </div>
    </article>
  )
}

function HostPage({ onToast }) {
  const [step, setStep] = useState(1)
  const totalSteps = 3
  const progress = `${(step / totalSteps) * 100}%`

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Barınma desteği"
        title="Evimi Açmak İstiyorum"
        description="Form kısa adımlara ayrılmıştır. Yayın öncesi telefon ve kimlik doğrulaması önerilir."
      />
      <form
        className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft sm:p-7"
        onSubmit={(event) => {
          event.preventDefault()
          onToast('Barınma ilanı admin onayına gönderildi')
        }}
      >
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-avuc-muted">
            <span>Adım {step} / {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-avuc-blue transition-all" style={{ width: progress }} />
          </div>
        </div>

        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Ad soyad" placeholder="Adınız Soyadınız" required />
            <TextInput label="Telefon" placeholder="05xx xxx xx xx" required />
            <TextInput label="Şehir" as="select" required>
              <option value="">Şehir seçin</option>
              {cities.map((city) => <option key={city}>{city}</option>)}
            </TextInput>
            <TextInput label="İlçe" placeholder="Şahinbey" required />
            <TextInput className="sm:col-span-2" label="Açık adres ya da yaklaşık konum" placeholder="Mahalle, cadde veya güvenli yakın konum" required />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Ev tipi" as="select" required>
              <option>Oda</option>
              <option>Tüm ev</option>
              <option>Yazlık</option>
              <option>Apart</option>
              <option>Misafirhane</option>
            </TextInput>
            <TextInput label="Kaç kişi kalabilir?" type="number" min="1" placeholder="3" required />
            <TextInput label="Kaç gün kalabilirler?" type="number" min="1" placeholder="7" required />
            <TextInput label="Kadın / erkek / karma uygunluğu" as="select" required>
              <option>Aile / karma</option>
              <option>Kadın</option>
              <option>Erkek</option>
              <option>Çocuklu aile</option>
            </TextInput>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {['Aileye uygun mu?', 'Çocuklu aileye uygun mu?', 'Evcil hayvan kabul ediyor mu?', 'Isınma var mı?', 'Mutfak kullanılabilir mi?', 'Banyo kullanılabilir mi?', 'Ulaşım imkanı var mı?'].map((label) => (
                <label key={label} className="flex items-center justify-between rounded-2xl border border-avuc-line bg-slate-50 px-4 py-3 text-sm font-bold text-avuc-text">
                  {label}
                  <input type="checkbox" className="h-5 w-5 accent-avuc-blue" />
                </label>
              ))}
            </div>
            <TextInput label="Ek açıklama" as="textarea" rows="5" placeholder="Evdeki imkanlar, özel koşullar ve ulaşım notları" />
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <PrimaryButton variant="light" onClick={() => setStep((current) => Math.max(1, current - 1))} className={step === 1 ? 'invisible' : ''}>Geri</PrimaryButton>
          {step < totalSteps ? (
            <PrimaryButton onClick={() => setStep((current) => Math.min(totalSteps, current + 1))}>Devam et</PrimaryButton>
          ) : (
            <PrimaryButton type="submit" variant="green">İlanı yayınla</PrimaryButton>
          )}
        </div>
      </form>
    </main>
  )
}

function MatchingPage({ onToast }) {
  const [selectedType, setSelectedType] = useState('Erzağım var, araç arıyorum')
  const [selectedListing, setSelectedListing] = useState(aidListings[1])
  const visibleListings = aidListings.filter((listing) => !selectedType || listing.type === selectedType)
  const suggestions = getSuggestions(selectedListing)

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Akıllı eşleştirme"
        title="Araç, erzak, depo ve gönüllü desteklerini eşleştir"
        description="Tamamlayıcı destekler aynı şehir veya yakın rota üzerinden önerilir."
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {aidTypes.map((type) => (
          <Button
            key={type}
            onClick={() => {
              setSelectedType(type)
              const firstMatch = aidListings.find((listing) => listing.type === type)
              setSelectedListing(firstMatch || null)
            }}
            variant={selectedType === type ? 'default' : 'neutral'}
            className={classNames(
              'h-auto min-w-fit rounded-2xl px-4 py-3 text-sm font-heading',
              selectedType === type ? 'bg-main text-mtext' : 'bg-bw text-text',
            )}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-4 xl:grid-cols-2">
          {visibleListings.map((listing) => (
            <AidListingCard key={listing.id} listing={listing} selected={selectedListing?.id === listing.id} onSelect={() => setSelectedListing(listing)} onToast={onToast} />
          ))}
        </section>

        <aside className="h-fit rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <Badge className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">Eşleşme önerileri</Badge>
          <h3 className="mt-4 text-xl font-black text-avuc-text">{selectedListing ? selectedListing.type : 'İlan seçin'}</h3>
          <p className="mt-2 text-sm leading-6 text-avuc-muted">
            {selectedListing ? `${selectedListing.location} için uygun tamamlayıcı destekler` : 'Bir ilan seçtiğinizde sistem yakın önerileri gösterecek.'}
          </p>
          <div className="mt-5 grid gap-3">
            {suggestions.length ? suggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-2xl border border-avuc-line bg-slate-50 p-4">
                <p className="text-sm font-black text-avuc-text">{suggestion.type}</p>
                <p className="mt-1 text-sm text-avuc-muted">{suggestion.location}</p>
                <p className="mt-2 text-xs font-semibold text-avuc-muted">{suggestion.offered}</p>
                <PrimaryButton onClick={() => onToast('Eşleşme önerisi güvenli kanala gönderildi')} className="mt-3 w-full min-h-10 py-2">Eşleşme öner</PrimaryButton>
              </div>
            )) : (
              <EmptyState title="Yakın öneri yok" description="Yeni araç, depo veya gönüllü ilanı geldiğinde burada görünecek." />
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

function getSuggestions(listing) {
  if (!listing) return []
  const city = cityFromLocation(listing.location)
  const sameCity = aidListings.filter((item) => item.id !== listing.id && cityFromLocation(item.location) === city)

  if (listing.type.includes('Erzağım var')) {
    return sameCity.filter((item) => item.type.includes('Aracım var')).concat(aidListings.filter((item) => item.type.includes('Aracım var') && item.id !== listing.id)).slice(0, 3)
  }

  if (listing.type.includes('Aracım var')) {
    return aidListings.filter((item) => item.id !== listing.id && (item.type.includes('Erzağım var') || item.type.includes('Depom var') || item.type.includes('ihtiyaç bildiriyorum'))).slice(0, 3)
  }

  return sameCity.concat(aidListings.filter((item) => item.id !== listing.id)).slice(0, 3)
}

function AidListingCard({ listing, selected, onSelect, onToast }) {
  return (
    <article className={classNames('card-hover rounded-[2rem] border bg-white p-5 shadow-soft', selected ? 'border-avuc-blue ring-4 ring-avuc-lightBlue' : 'border-avuc-line')}>
      <div className="flex items-start justify-between gap-3">
        <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">{listing.type}</Badge>
        <Badge className={getStatusClass(listing.status)}>{listing.status}</Badge>
      </div>
      <h3 className="mt-4 text-xl font-black text-avuc-text">{listing.location}</h3>
      <div className="mt-4 grid gap-2">
        {[
          ['Sunulan destek', listing.offered],
          ['İhtiyaç duyulan destek', listing.needed],
          ['Müsaitlik', listing.availability],
          ['Taşıma kapasitesi', listing.capacity],
          ['Aciliyet', listing.urgency],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-avuc-muted">
            <span className="font-black text-avuc-text">{label}:</span> {value}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PrimaryButton onClick={onSelect} variant={selected ? 'green' : 'blue'}>{selected ? 'Seçildi' : 'İlanı seç'}</PrimaryButton>
        <PrimaryButton onClick={() => onToast('Eşleşme önerisi kaydedildi')} variant="light">Eşleşme öner</PrimaryButton>
      </div>
    </article>
  )
}

function DonationsPage({ onToast }) {
  const [selectedPackage, setSelectedPackage] = useState(donationPackages[0])
  const [trackingStep, setTrackingStep] = useState(1)
  const steps = ['Bağış alındı', 'Paket hazırlanıyor', 'Araca yüklendi', 'Bölgeye ulaştı', 'Teslim edildi']

  useEffect(() => {
    if (!selectedPackage) return undefined
    setTrackingStep(1)
    const timer = window.setInterval(() => {
      setTrackingStep((current) => (current >= steps.length ? steps.length : current + 1))
    }, 1600)
    return () => window.clearInterval(timer)
  }, [selectedPackage, steps.length])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Bağış"
        title="Hazır yardım paketleriyle destek ol"
        description="Her paket içerik, tahmini fiyat ve kaç kişiye destek olduğu bilgisiyle şeffaf takip edilir."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {donationPackages.map((item) => (
            <article key={item.id} className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-black text-avuc-text">{item.name}</h3>
                <Badge className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">{item.price}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-avuc-muted">{item.supports}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.items.map((content) => <Badge key={content} className="border-avuc-line bg-slate-50 text-avuc-muted">{content}</Badge>)}
              </div>
              <PrimaryButton
                onClick={() => {
                  setSelectedPackage(item)
                  onToast(`${item.name} bağışı için takip akışı başlatıldı`)
                }}
                className="mt-5 w-full"
                variant={selectedPackage?.id === item.id ? 'green' : 'blue'}
              >
                Bağış yap
              </PrimaryButton>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">Yardım takip sistemi</Badge>
          <h3 className="mt-4 text-xl font-black text-avuc-text">{selectedPackage?.name}</h3>
          <p className="mt-2 text-sm leading-6 text-avuc-muted">Bağış sonrası paket hareketleri örnek takip akışıyla gösterilir.</p>
          <div className="mt-6 grid gap-4">
            {steps.map((step, index) => {
              const active = index + 1 <= trackingStep
              return (
                <div key={step} className="flex gap-3">
                  <div className={classNames('mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black', active ? 'bg-avuc-green text-white' : 'bg-slate-100 text-avuc-muted')}>
                    {index + 1}
                  </div>
                  <div>
                    <p className={classNames('font-black', active ? 'text-avuc-text' : 'text-avuc-muted')}>{step}</p>
                    <p className="text-xs font-semibold text-avuc-muted">{active ? 'Tamamlandı veya işlemde' : 'Sıradaki adım'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </main>
  )
}

function MapPage({ onNavigate }) {
  const [selectedType, setSelectedType] = useState('Tümü')
  const types = ['Tümü', ...Array.from(new Set(mapPoints.map((point) => point.type)))]
  const points = selectedType === 'Tümü' ? mapPoints : mapPoints.filter((point) => point.type === selectedType)

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Afet haritası"
        title="Harita ve liste görünümü"
        description="Gerçek harita API’si yerine dummy, filtrelenebilir pin alanı kullanılır."
        action={<PrimaryButton onClick={() => onNavigate('create')}>Yeni nokta bildir</PrimaryButton>}
      />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {types.map((type) => (
          <Button
            key={type}
            onClick={() => setSelectedType(type)}
            variant={selectedType === type ? 'default' : 'neutral'}
            className={classNames('h-auto min-w-fit rounded-2xl px-4 py-3 text-sm font-heading', selectedType === type ? 'bg-main text-mtext' : 'bg-bw text-text')}
          >
            {type}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-avuc-line bg-white shadow-soft">
          <div className="map-grid absolute inset-0" />
          <div className="absolute left-6 top-6 rounded-2xl border border-avuc-line bg-white/90 p-4 shadow-soft backdrop-blur">
            <p className="text-sm font-black text-avuc-text">Canlı koordinasyon katmanı</p>
            <p className="mt-1 text-xs font-semibold text-avuc-muted">Pinler dummy veriyle gösterilir</p>
          </div>
          {points.map((point) => (
            <Button
              key={point.id}
              variant="noShadow"
              className="absolute flex h-auto w-auto -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-full !border-0 !bg-transparent p-0 shadow-none hover:translate-x-[-50%] hover:translate-y-[-50%] focus-visible:outline-white"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={point.title}
            >
              <span className="absolute h-10 w-10 animate-ping rounded-full opacity-25" style={{ backgroundColor: point.color }} />
              <span className="relative h-7 w-7 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: point.color }} />
              <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-black text-avuc-text shadow-soft sm:block">{point.type}</span>
            </Button>
          ))}
          <div className="absolute bottom-6 left-6 right-6 grid gap-2 rounded-2xl border border-avuc-line bg-white/90 p-4 text-xs font-bold text-avuc-muted shadow-soft backdrop-blur sm:grid-cols-3">
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-avuc-red" />Kırmızı: acil ihtiyaç</span>
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-avuc-blue" />Mavi: barınma</span>
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-avuc-green" />Yeşil: yardım noktası</span>
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-avuc-orange" />Turuncu: yardım yolda</span>
            <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-violet-600" />Mor: depo / lojistik</span>
          </div>
        </section>

        <aside className="grid h-fit gap-3">
          {points.map((point) => (
            <article key={point.id} className="rounded-[1.5rem] border border-avuc-line bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: point.color }} />
                <div>
                  <h3 className="font-black text-avuc-text">{point.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-avuc-muted">{point.location}</p>
                  <p className="mt-2 text-sm leading-6 text-avuc-muted">{point.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </aside>
      </div>
    </main>
  )
}

function VolunteerPage({ onToast }) {
  const [joined, setJoined] = useState([])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Gönüllü ağı"
        title="Gönüllü görevleri"
        description="Paketleme, dağıtım, araçla taşıma, depo düzenleme ve özel destek görevlerine katılın."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {volunteerTasks.map((task) => {
          const isJoined = joined.includes(task.id)
          return (
            <article key={task.id} className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">{task.location}</Badge>
              <h3 className="mt-4 text-xl font-black text-avuc-text">{task.title}</h3>
              <p className="mt-2 text-sm font-semibold text-avuc-muted">{task.time}</p>
              <p className="mt-4 text-sm leading-6 text-avuc-muted">{task.description}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-avuc-text">Gerekli kişi sayısı: {task.people}</div>
              <PrimaryButton
                variant={isJoined ? 'green' : 'blue'}
                className="mt-5 w-full"
                onClick={() => {
                  if (!isJoined) {
                    setJoined((current) => [...current, task.id])
                    onToast(`${task.title} görevine katıldınız`)
                  }
                }}
              >
                {isJoined ? 'Katılım alındı' : 'Katıl'}
              </PrimaryButton>
            </article>
          )
        })}
      </div>
    </main>
  )
}

function CreateListingPage({ onToast }) {
  const [category, setCategory] = useState('Kalacak yer sunuyorum')
  const categoryFields = getCategoryFields(category)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="İlan oluşturma akışı"
        title="Önce kategori seçin"
        description="Seçilen kategoriye göre ilgili kısa form açılır. Böylece afet anında kullanıcı gereksiz alanlarla uğraşmaz."
      />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="grid h-fit gap-2 rounded-[2rem] border border-avuc-line bg-white p-4 shadow-soft">
          {createCategories.map((item) => (
            <Button
              key={item}
              onClick={() => setCategory(item)}
              variant={category === item ? 'default' : 'neutral'}
              className={classNames('h-auto justify-start rounded-2xl px-4 py-3 text-left text-sm font-heading', category === item ? 'bg-main text-mtext' : 'bg-bw text-text')}
            >
              {item}
            </Button>
          ))}
        </aside>

        <form
          className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft sm:p-7"
          onSubmit={(event) => {
            event.preventDefault()
            onToast(`${category} ilanı admin onayına gönderildi`)
          }}
        >
          <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">{category}</Badge>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <TextInput label="Ad soyad" placeholder="Adınız Soyadınız" required />
            <TextInput label="Telefon" placeholder="05xx xxx xx xx" required />
            <TextInput label="Şehir" as="select" required>
              <option value="">Şehir seçin</option>
              {cities.map((city) => <option key={city}>{city}</option>)}
            </TextInput>
            <TextInput label="İlçe / konum" placeholder="Merkez" required />
            {categoryFields.map((field) => (
              <TextInput key={field.label} label={field.label} as={field.type === 'textarea' ? 'textarea' : field.type === 'select' ? 'select' : 'input'} rows={field.type === 'textarea' ? 4 : undefined} placeholder={field.placeholder} required={field.required}>
                {field.options?.map((option) => <option key={option}>{option}</option>)}
              </TextInput>
            ))}
            <TextInput className="sm:col-span-2" label="Ek açıklama" as="textarea" rows="4" placeholder="Kısa ve net bilgi yazın" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton type="submit" className="flex-1">İlanı gönder</PrimaryButton>
            <PrimaryButton variant="light" className="flex-1" onClick={() => onToast('Taslak kaydedildi')}>Taslak kaydet</PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  )
}

function getCategoryFields(category) {
  const shared = {
    shelter: [
      { label: 'Kaç kişi kalabilir?', placeholder: '3', required: true },
      { label: 'Kaç gün?', placeholder: '7', required: true },
      { label: 'Aile / çocuk / evcil hayvan uygunluğu', type: 'textarea', required: true },
    ],
    requestShelter: [
      { label: 'Kaç kişisiniz?', placeholder: '4', required: true },
      { label: 'Özel durum', type: 'textarea', placeholder: 'Çocuklu aile, yaşlı birey, engelli birey vb.', required: true },
    ],
    vehicle: [
      { label: 'Araç tipi', type: 'select', options: ['Minibüs', 'Kamyonet', 'Kamyon', 'Binek araç'], required: true },
      { label: 'Taşıma kapasitesi', placeholder: '1 ton', required: true },
      { label: 'Müsaitlik zamanı', placeholder: 'Bugün 18.00', required: true },
    ],
    food: [
      { label: 'Yardım içeriği', placeholder: '50 koli kuru gıda', required: true },
      { label: 'Aranan destek', placeholder: 'Araç / depo / gönüllü', required: true },
    ],
    depot: [
      { label: 'Depo kapasitesi', placeholder: '200 m2 / 400 koli', required: true },
      { label: 'Çalışma saatleri', placeholder: '24 saat', required: true },
    ],
    volunteer: [
      { label: 'Katılabileceğiniz görev', type: 'select', options: ['Erzak paketleme', 'Yardım dağıtımı', 'Araçla taşıma', 'Depo düzenleme', 'Barınma koordinasyonu'], required: true },
      { label: 'Müsaitlik', placeholder: 'Hafta içi akşam', required: true },
    ],
    urgent: [
      { label: 'İhtiyaç türü', type: 'select', options: ['Gıda', 'Su', 'Barınma', 'Araç', 'Hijyen', 'Bebek ürünü'], required: true },
      { label: 'Kişi sayısı', placeholder: '20', required: true },
      { label: 'Aciliyet seviyesi', type: 'select', options: ['Acil', 'Yüksek', 'Orta'], required: true },
    ],
  }

  if (category === 'Kalacak yer sunuyorum') return shared.shelter
  if (category === 'Kalacak yer arıyorum') return shared.requestShelter
  if (category === 'Aracım var') return shared.vehicle
  if (category === 'Erzağım var') return shared.food
  if (category === 'Depom var') return shared.depot
  if (category === 'Gönüllüyüm') return shared.volunteer
  return shared.urgent
}

function ProfilePage({ onNavigate }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Kullanıcı profili"
        title="Güven rozeti ve yardım geçmişi"
        description="Profil, doğrulama durumlarını, ilanları, görevleri, bağışları ve tamamlanan yardımları tek yerde toplar."
        action={<PrimaryButton onClick={() => onNavigate('create')}>Yeni ilan ver</PrimaryButton>}
      />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-avuc-blue text-2xl font-black text-white shadow-glow">EK</div>
          <h2 className="mt-5 text-2xl font-black text-avuc-text">{profileData.name}</h2>
          <p className="mt-2 text-sm font-semibold text-avuc-muted">Telefon: {profileData.phone}</p>
          <p className="mt-1 text-sm font-semibold text-avuc-muted">Kimlik: {profileData.identity}</p>
          <div className="mt-5 rounded-3xl bg-avuc-lightGreen p-5 text-avuc-success">
            <p className="text-sm font-bold">Kullanıcı puanı</p>
            <p className="mt-1 text-4xl font-black">{profileData.score}</p>
          </div>
          <PrimaryButton variant="light" className="mt-5 w-full">Doğrulama detayları</PrimaryButton>
        </aside>

        <section className="grid gap-5">
          <ProfilePanel title="Rozetler" items={profileData.badges} badge />
          <div className="grid gap-5 md:grid-cols-2">
            <ProfilePanel title="Verdiği ilanlar" items={profileData.listings} />
            <ProfilePanel title="Katıldığı görevler" items={profileData.tasks} />
            <ProfilePanel title="Yaptığı bağışlar" items={profileData.donations} />
            <ProfilePanel title="Yardım geçmişi" items={profileData.history} />
          </div>
        </section>
      </div>
    </main>
  )
}

function ProfilePanel({ title, items, badge = false }) {
  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
      <h3 className="text-xl font-black text-avuc-text">{title}</h3>
      <div className={classNames('mt-4', badge ? 'flex flex-wrap gap-2' : 'grid gap-2')}>
        {items.map((item) => badge ? (
          <Badge key={item} className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">{item}</Badge>
        ) : (
          <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-avuc-muted">{item}</div>
        ))}
      </div>
    </div>
  )
}

function AdminPage({ onToast }) {
  const [pending, setPending] = useState(adminData.pendingListings)
  const [reports, setReports] = useState(adminData.reports)

  const resolvePending = (id, action) => {
    setPending((current) => current.filter((item) => item.id !== id))
    onToast(`İlan ${action}`)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Admin"
        title="Sade yönetim paneli"
        description="Bekleyen ilanlar, şikayetler, bağış takibi, kullanıcı doğrulamaları ve gönüllü görevleri tek ekrandan yönetilir."
      />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Bekleyen ilan', pending.length],
          ['Sahte ilan raporu', reports.length],
          ['Aktif afet bölgesi', disasterZones.length],
          ['Takipte bağış', adminData.donations.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-avuc-line bg-white p-5 shadow-soft">
            <p className="text-3xl font-black text-avuc-text">{value}</p>
            <p className="mt-1 text-sm font-bold text-avuc-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Bekleyen ilanları onayla / reddet">
          {pending.length ? pending.map((item) => (
            <div key={item.id} className="rounded-2xl border border-avuc-line bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-avuc-text">{item.title}</p>
                  <p className="mt-1 text-sm text-avuc-muted">{item.owner} · {item.type} · {item.status}</p>
                </div>
                <Badge className="border-avuc-orange/20 bg-avuc-lightOrange text-amber-700">Bekliyor</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <PrimaryButton onClick={() => resolvePending(item.id, 'onaylandı')} variant="green" className="min-h-10 flex-1 py-2">Onayla</PrimaryButton>
                <PrimaryButton onClick={() => resolvePending(item.id, 'reddedildi')} variant="danger" className="min-h-10 flex-1 py-2">Reddet</PrimaryButton>
              </div>
            </div>
          )) : <EmptyState title="Bekleyen ilan yok" description="Yeni ilanlar geldiğinde burada listelenecek." />}
        </AdminPanel>

        <AdminPanel title="Sahte ilanları kaldır">
          {reports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-avuc-line bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-avuc-text">{report.title}</p>
                  <p className="mt-1 text-sm text-avuc-muted">{report.reason}</p>
                </div>
                <Badge className={getUrgencyClass(report.priority)}>{report.priority}</Badge>
              </div>
              <PrimaryButton onClick={() => {
                setReports((current) => current.filter((item) => item.id !== report.id))
                onToast('Şikayet incelenmiş olarak kapatıldı')
              }} variant="light" className="mt-4 w-full min-h-10 py-2">İncele ve kapat</PrimaryButton>
            </div>
          ))}
        </AdminPanel>

        <AdminPanel title="Acil ihtiyaç ve afet bölgesi ekle">
          <form className="grid gap-3" onSubmit={(event) => {
            event.preventDefault()
            onToast('Yeni acil ihtiyaç taslağı oluşturuldu')
          }}>
            <TextInput label="Konum" placeholder="Hatay / Antakya" />
            <TextInput label="İhtiyaç" placeholder="20 kişilik sıcak yemek" />
            <TextInput label="Durum" as="select"><option>Acil</option><option>Yardım bekliyor</option><option>Yardım yolda</option></TextInput>
            <PrimaryButton type="submit">Ekle</PrimaryButton>
          </form>
        </AdminPanel>

        <AdminPanel title="Bağışları ve doğrulamaları takip et">
          <div className="grid gap-3">
            {adminData.donations.map((donation) => (
              <div key={donation.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-black text-avuc-text">{donation.package}</p>
                <p className="mt-1 font-semibold text-avuc-muted">{donation.donor} · {donation.status}</p>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              <PrimaryButton variant="light">Kullanıcı doğrulamaları</PrimaryButton>
              <PrimaryButton variant="light">Gönüllü görevi oluştur</PrimaryButton>
              <PrimaryButton variant="light">Tamamlanan yardımlar</PrimaryButton>
              <PrimaryButton variant="light">Kurum onayları</PrimaryButton>
            </div>
          </div>
        </AdminPanel>
      </div>
    </main>
  )
}

function AdminPanel({ title, children }) {
  return (
    <section className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-xl font-black text-avuc-text">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [isSwitching, setIsSwitching] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.title = `avuc | ${pageTitles[activePage] || 'Afet Yardım Koordinasyonu'}`
  }, [activePage])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const showToast = (message) => setToast(message)

  const navigate = (page) => {
    setIsSwitching(true)
    startTransition(() => {
      setActivePage(page)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.setTimeout(() => setIsSwitching(false), 350)
  }

  const page = {
    home: <HomePage onNavigate={navigate} onToast={showToast} />,
    shelter: <ShelterPage onNavigate={navigate} onToast={showToast} />,
    host: <HostPage onToast={showToast} />,
    match: <MatchingPage onToast={showToast} />,
    donations: <DonationsPage onToast={showToast} />,
    map: <MapPage onNavigate={navigate} />,
    urgent: <UrgentNeedsPage onNavigate={navigate} />,
    volunteer: <VolunteerPage onToast={showToast} />,
    create: <CreateListingPage onToast={showToast} />,
    profile: <ProfilePage onNavigate={navigate} />,
    admin: <AdminPage onToast={showToast} />,
  }[activePage]

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-24 text-avuc-text lg:pb-0">
      <div className="fixed inset-0 z-0">
        <InfiniteGridBackground />
      </div>
      <div className="relative z-10">
        <LoadingBar active={isSwitching} />
        <Header activePage={activePage} onNavigate={navigate} />
        <div className="animate-slide-up" key={activePage}>{page}</div>
        <FloatingEmergencyButton onClick={() => setEmergencyOpen(true)} />
        <MobileBottomNav activePage={activePage} onNavigate={navigate} />
        <EmergencyModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} onSubmit={showToast} />
        <Toast message={toast} />
      </div>
    </div>
  )
}

export default App
