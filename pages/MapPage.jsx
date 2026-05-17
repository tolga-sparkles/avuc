import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { RadarScanner } from '@/components/effects/RadarScanner'
import { mapPoints } from '@/data'
import { classNames } from '@/utils/classNames'

export default function MapPage({ onNavigate }) {
  const [selectedType, setSelectedType] = useState('Tümü')
  const types = ['Tümü', ...Array.from(new Set(mapPoints.map((point) => point.type)))]
  const points = selectedType === 'Tümü' ? mapPoints : mapPoints.filter((point) => point.type === selectedType)

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Afet haritası"
        title="Harita ve liste görünümü"
        description="Gerçek harita API'si yerine dummy, filtrelenebilir pin alanı kullanılır."
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
        <section className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-avuc-line bg-white shadow-soft md:min-h-[560px]">
          <div className="map-grid absolute inset-0" />
          <div className="absolute left-6 top-6 rounded-2xl border border-avuc-line bg-white/90 p-4 shadow-soft backdrop-blur">
            <p className="text-sm font-black text-avuc-text">Canlı koordinasyon katmanı</p>
            <p className="mt-1 text-xs font-semibold text-avuc-muted">Pinler dummy veriyle gösterilir</p>
          </div>
          <div className="absolute right-6 top-6 z-10 hidden rounded-2xl border border-avuc-line bg-white/90 p-3 shadow-soft backdrop-blur sm:block">
            <RadarScanner />
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
