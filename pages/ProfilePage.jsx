import { SectionHeader } from '@/components/layout/SectionHeader'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { classNames } from '@/utils/classNames'
import {
  ShieldCheck,
  HeartHandshake,
  Zap,
  Heart,
  Star,
  Package,
  Droplets,
  MapPin,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  Baby,
  ArrowRightLeft,
  Phone,
  FileCheck,
} from 'lucide-react'

const DUMMY_BADGES = [
  { label: 'Doğrulandı', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Gönüllü', icon: HeartHandshake, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Hızlı Yanıt', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { label: 'Bağışçı', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { label: 'Güvenilir', icon: Star, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
]

const DUMMY_LISTINGS = [
  { title: 'Battaniye ihtiyacı', location: 'Şahinbey', status: 'Aktif', icon: Package, statusColor: 'bg-green-50 text-green-700 border-green-200' },
  { title: 'Su desteği talebi', location: 'Karataş', status: 'Aktif', icon: Droplets, statusColor: 'bg-green-50 text-green-700 border-green-200' },
]

const DUMMY_TASKS = [
  { title: 'Gıda dağıtımı', date: '15 May 2025', time: '09:30', status: 'Tamamlandı', icon: ClipboardCheck, statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { title: 'Mahalle kontrolü', date: '14 May 2025', time: '16:00', status: 'Tamamlandı', icon: CheckCircle2, statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
]

const DUMMY_DONATIONS = [
  { name: 'Hijyen paketi', date: '15 May 2025', amount: '150 TL', icon: Sparkles },
  { name: 'Mama desteği', date: '14 May 2025', amount: '80 TL', icon: Baby },
]

const DUMMY_HISTORY = [
  { text: '“Battaniye ihtiyacı” ilanı için yardım teklifinde bulundu.', date: '15 May 2025', time: '10:15', icon: ArrowRightLeft },
  { text: 'Telefon numarası doğrulandı.', date: '15 May 2025', time: '09:42', icon: Phone },
  { text: '“Su desteği talebi” ilanı tamamlandı.', date: '14 May 2025', time: '18:30', icon: FileCheck },
]

export default function ProfilePage({ onNavigate }) {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <EmptyState
          title="Giriş yapmanız gerekiyor"
          description="Profilinizi görüntülemek için lütfen giriş yapın."
          action={<PrimaryButton onClick={() => onNavigate('home')}>Ana Sayfaya Dön</PrimaryButton>}
        />
      </main>
    )
  }

  const name = user?.name || 'Kullanıcı'
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

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
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-avuc-blue text-2xl font-black text-white shadow-glow">{initials}</div>
          <h2 className="mt-5 text-2xl font-black text-avuc-text">{name}</h2>
          <p className="mt-2 text-sm font-semibold text-avuc-muted">Telefon: {user?.phone || '-'}</p>
          <p className="mt-1 text-sm font-semibold text-avuc-muted">E-posta: {user?.email || '-'}</p>
          <div className="mt-5 rounded-3xl bg-avuc-lightGreen p-5 text-avuc-success">
            <p className="text-sm font-bold">Kullanıcı puanı</p>
            <p className="mt-1 text-4xl font-black">{user?.score || 0}</p>
          </div>
          <PrimaryButton variant="light" className="mt-5 w-full" onClick={() => alert('Yakında')}>Doğrulama detayları</PrimaryButton>
        </aside>

        <section className="grid gap-5">
          {/* Rozetler */}
          <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
            <h3 className="text-xl font-black text-avuc-text">Rozetler</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {DUMMY_BADGES.map((badge) => {
                const Icon = badge.icon
                return (
                  <span
                    key={badge.label}
                    className={classNames(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
                      badge.bg,
                      badge.color,
                      badge.border
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {badge.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Verdiği ilanlar */}
            <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <h3 className="text-xl font-black text-avuc-text">Verdiği ilanlar</h3>
              <div className="mt-4 grid gap-2">
                {DUMMY_LISTINGS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-avuc-line">
                        <Icon className="h-4 w-4 text-avuc-blue" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-avuc-text">{item.title}</p>
                        <p className="text-[11px] text-avuc-muted flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{item.location}
                        </p>
                      </div>
                      <span className={classNames('rounded-full border px-2.5 py-0.5 text-[10px] font-bold', item.statusColor)}>
                        {item.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Katıldığı görevler */}
            <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <h3 className="text-xl font-black text-avuc-text">Katıldığı görevler</h3>
              <div className="mt-4 grid gap-2">
                {DUMMY_TASKS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-avuc-line">
                        <Icon className="h-4 w-4 text-avuc-blue" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-avuc-text">{item.title}</p>
                        <p className="text-[11px] text-avuc-muted">{item.date} • {item.time}</p>
                      </div>
                      <span className={classNames('rounded-full border px-2.5 py-0.5 text-[10px] font-bold', item.statusColor)}>
                        {item.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Yaptığı bağışlar */}
            <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <h3 className="text-xl font-black text-avuc-text">Yaptığı bağışlar</h3>
              <div className="mt-4 grid gap-2">
                {DUMMY_DONATIONS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-avuc-line">
                        <Icon className="h-4 w-4 text-avuc-blue" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-avuc-text">{item.name}</p>
                        <p className="text-[11px] text-avuc-muted">{item.date}</p>
                      </div>
                      <span className="text-sm font-black text-green-600">{item.amount}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Yardım geçmişi */}
            <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
              <h3 className="text-xl font-black text-avuc-text">Yardım geçmişi</h3>
              <div className="mt-4 grid gap-3">
                {DUMMY_HISTORY.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-avuc-line mt-0.5">
                        <Icon className="h-4 w-4 text-avuc-muted" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-avuc-text leading-snug">{item.text}</p>
                        <p className="text-[11px] text-avuc-muted mt-0.5">{item.date} • {item.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
