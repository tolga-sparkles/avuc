import { useState } from 'react'
import { Shield, CloudRain, Siren, Map, CloudRain as CloudRainIcon, Activity, ChevronDown, ChevronUp, Home, LogIn, Truck, HandCoins } from 'lucide-react'
import { Badge } from '@/components/layout/Badge'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { UrgentNeedsSection } from '@/components/layout/UrgentNeedsSection'
import { AnimatedCounter } from '@/components/effects/AnimatedCounter'
import { useEarthquakes } from '@/hooks/useEarthquakes'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { disasterZones } from '@/data'
import { getUrgencyClass } from '@/utils/constants'
import { classNames } from '@/utils/classNames'
import { GlobeLive } from '@/components/ui/cobe-globe-live'

function getMagnitudeColor(mag) {
  if (mag >= 5.0) return 'bg-red-600 text-white'
  if (mag >= 4.0) return 'bg-orange-500 text-white'
  if (mag >= 3.0) return 'bg-amber-400 text-avuc-text'
  return 'bg-green-500 text-white'
}

export default function HomePage({ onNavigate }) {
  const { quakes, loading: quakesLoading, refetch: refetchQuakes } = useEarthquakes()
  const [showAllQuakes, setShowAllQuakes] = useState(false)

  usePullToRefresh(() => {
    refetchQuakes()
    window.location.reload()
  })

  return (
    <div className="space-y-12 pb-20">
      <section className="relative -mt-12 overflow-hidden rounded-b-[2.5rem] bg-transparent pt-12">
        <div className="absolute left-8 top-6 h-24 w-24 rounded-full bg-avuc-lightBlue/60 blur-2xl" />
        <div className="absolute bottom-6 right-12 h-32 w-32 rounded-full bg-avuc-lightGreen/60 blur-2xl" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-12">
          <div className="relative z-10 flex flex-col justify-center">
            <Badge className="w-fit border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">Koordinasyon ağı</Badge>
            <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-avuc-text sm:text-4xl lg:text-[2.8rem] lg:leading-[1.05]">
              Afet Anında Yardımı Doğru Kişiye Ulaştır
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-avuc-muted">
              Barınma, lojistik ve bağışı tek akışta eşleştirir.
            </p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <button
                onClick={() => onNavigate('shelter')}
                className="inline-flex items-center justify-start gap-3 rounded-[16px] bg-avuc-blue px-4 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
              >
                <Home className="h-4 w-4" />
                <span>Kalacak Yer</span>
              </button>
              <button
                onClick={() => onNavigate('host')}
                className="inline-flex items-center justify-start gap-3 rounded-[16px] bg-[#e6fdf5] px-4 py-3 text-sm font-semibold text-[#0fa968] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#cbfbe7]"
              >
                <LogIn className="h-4 w-4" />
                <span>Evimi Aç</span>
              </button>
              <button
                onClick={() => onNavigate('match')}
                className="inline-flex items-center justify-start gap-3 rounded-[16px] bg-[#fff4e6] px-4 py-3 text-sm font-semibold text-[#b76e00] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffe8cc]"
              >
                <Truck className="h-4 w-4" />
                <span>Yardım Götür</span>
              </button>
              <button
                onClick={() => onNavigate('donations')}
                className="inline-flex items-center justify-start gap-3 rounded-[16px] bg-[#f3e8ff] px-4 py-3 text-sm font-semibold text-[#6b21a8] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e9d5ff]"
              >
                <HandCoins className="h-4 w-4" />
                <span>Bağış Yap</span>
              </button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                [248, 'Aktif ilan'],
                [71, 'Eşleşen yardım'],
                [96, 'Güven puanı', '%'],
              ].map(([value, label, suffix]) => (
                <div key={label} className="rounded-2xl border border-avuc-line bg-white p-3 shadow-soft">
                  <p className="text-lg font-black text-avuc-text">
                    <AnimatedCounter target={value} duration={2000} suffix={suffix || ''} />
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-avuc-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center overflow-visible sm:min-h-[470px] lg:min-h-[620px]">
            <div className="absolute left-0 top-0 z-10">
              <p className="text-sm font-black tracking-[0.2em] text-avuc-muted">birOS Ağ</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-avuc-muted">Afet ağı gerçek zamanlı olarak toplanmaktadır.</p>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_52%_58%,rgba(219,234,254,0.5),transparent_48%),radial-gradient(circle_at_76%_72%,rgba(220,252,231,0.42),transparent_36%)]" />
            <GlobeLive className="relative z-10 mt-14 w-[min(390px,118%)] max-w-none sm:w-[min(560px,125%)] lg:mt-8 lg:w-[min(900px,160%)]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-avuc-blue">Gerçek zamanlı</p>
            <h2 className="text-2xl font-black tracking-tight text-avuc-text sm:text-3xl">Son Depremler</h2>
            <p className="mt-1 text-sm text-avuc-muted">Canlı veri — Kandilli Rasathanesi (Türkiye)</p>
          </div>
          <Badge className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">{quakesLoading ? 'Senkronize ediliyor...' : 'Canlı'}</Badge>
        </div>
        {quakesLoading ? (
          <div className="flex items-center gap-2 text-sm text-avuc-muted">
            <Activity className="h-4 w-4 animate-pulse" />
            Deprem verisi yükleniyor...
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {(showAllQuakes ? quakes : quakes.slice(0, 3)).map((q) => (
                <article key={`${q.detailUrl}-${q.date}-${q.latitude}`} className="card-hover flex items-center gap-4 rounded-[1.5rem] border border-avuc-line bg-white p-4 shadow-soft">
                  <div className={classNames('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black', getMagnitudeColor(q.magnitude))}>
                    {q.magnitude.toFixed(1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-avuc-text">{q.location}</p>
                    <p className="mt-0.5 text-xs text-avuc-muted">{q.date} · {q.depthKm} km derinlik</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-avuc-muted">{q.latitude.toFixed(2)}, {q.longitude.toFixed(2)}</p>
                  </div>
                </article>
              ))}
            </div>
            {quakes.length > 3 && (
              <button
                onClick={() => setShowAllQuakes((v) => !v)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-avuc-line bg-slate-50 py-3 text-sm font-bold text-avuc-muted transition hover:bg-slate-100"
              >
                {showAllQuakes ? (
                  <>
                    <ChevronUp className="h-4 w-4" /> Daha az göster
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" /> Daha fazla göster ({quakes.length - 3} deprem)
                  </>
                )}
              </button>
            )}
          </>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-avuc-blue">Canlı koordinasyon</p>
            <h2 className="text-2xl font-black tracking-tight text-avuc-text sm:text-3xl">Aktif afet bölgeleri</h2>
          </div>
          <PrimaryButton variant="light" onClick={() => onNavigate('map')}>Haritada gör</PrimaryButton>
        </div>
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-avuc-blue">Süreç</p>
            <h2 className="text-2xl font-black tracking-tight text-avuc-text sm:text-3xl">Yardım nasıl çalışır?</h2>
          </div>
        </div>
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-avuc-blue">Afet Öncesi</p>
            <h2 className="text-2xl font-black tracking-tight text-avuc-text sm:text-3xl">Acil Durum Araçları</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Hava Durumu', desc: 'Anlık ve 5 günlük tahmin', icon: CloudRainIcon, page: 'weather', color: 'bg-sky-50 text-sky-600' },
            { title: 'Acil Durum', desc: 'Siren, mors, konum paylaş', icon: Siren, page: 'emergency', color: 'bg-red-50 text-red-600' },
            { title: 'Hazırlık', desc: 'Deprem çantası ve rehber', icon: Shield, page: 'prep', color: 'bg-green-50 text-green-600' },
            { title: 'Toplanma Alanı', desc: 'En yakın alan ve rota', icon: Map, page: 'gathering', color: 'bg-purple-50 text-purple-600' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className="card-hover flex flex-col items-start rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft text-left"
              >
                <div className={classNames('flex h-12 w-12 items-center justify-center rounded-2xl', item.color.split(' ')[0])}>
                  <Icon className={classNames('h-6 w-6', item.color.split(' ')[1])} />
                </div>
                <h3 className="mt-4 text-lg font-black text-avuc-text">{item.title}</h3>
                <p className="mt-1 text-sm text-avuc-muted">{item.desc}</p>
              </button>
            )
          })}
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
