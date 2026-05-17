import { SectionHeader } from '@/components/layout/SectionHeader'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { classNames } from '@/utils/classNames'

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
          <PrimaryButton variant="light" className="mt-5 w-full">Doğrulama detayları</PrimaryButton>
        </aside>

        <section className="grid gap-5">
          <ProfilePanel title="Rozetler" items={user?.badges || []} badge />
          <div className="grid gap-5 md:grid-cols-2">
            <ProfilePanel title="Verdiği ilanlar" items={user?.listings || []} />
            <ProfilePanel title="Katıldığı görevler" items={user?.tasks || []} />
            <ProfilePanel title="Yaptığı bağışlar" items={user?.donations || []} />
            <ProfilePanel title="Yardım geçmişi" items={user?.history || []} />
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
          <span key={item} className="inline-flex items-center rounded-full border border-avuc-green/20 bg-avuc-lightGreen px-3 py-1 text-xs font-semibold text-avuc-success">{item}</span>
        ) : (
          <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-avuc-muted">{item}</div>
        ))}
      </div>
    </div>
  )
}
