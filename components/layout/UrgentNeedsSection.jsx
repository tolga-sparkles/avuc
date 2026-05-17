import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/layout/Badge'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { getStatusClass, getUrgencyClass } from '@/utils/constants'
import { urgentNeeds } from '@/data'

export function UrgentNeedsSection({ onNavigate, limit }) {
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
