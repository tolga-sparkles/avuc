import { useState } from 'react'
import { Activity, ChevronDown, ChevronUp, AlertOctagon, Phone, MapPin, Clock, User } from 'lucide-react'
import { Badge } from '@/components/layout/Badge'
import { classNames } from '@/utils/classNames'

export function getReportTypeLabel(type) {
  const labels = {
    earthquake: 'Deprem',
    fire: 'Yangın',
    flood: 'Sel',
    landslide: 'Heyelan',
    storm: 'Fırtına',
    avalanche: 'Çığ',
    other: 'Diğer',
  }
  return labels[type] || type
}

export function getReportTypeColor(type) {
  const colors = {
    earthquake: 'bg-red-100 text-red-700 border-red-200',
    fire: 'bg-orange-100 text-orange-700 border-orange-200',
    flood: 'bg-blue-100 text-blue-700 border-blue-200',
    landslide: 'bg-amber-100 text-amber-700 border-amber-200',
    storm: 'bg-purple-100 text-purple-700 border-purple-200',
    avalanche: 'bg-sky-100 text-sky-700 border-sky-200',
    other: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  return colors[type] || colors.other
}

export default function DisasterReportsSection({ reports, loading }) {
  const [expanded, setExpanded] = useState(false)
  const display = expanded ? reports : reports.slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-avuc-red">Canlı ihbar</p>
          <h2 className="text-2xl font-black tracking-tight text-avuc-text sm:text-3xl">Anlık Afet İhbarları</h2>
          <p className="mt-1 text-sm text-avuc-muted">Vatandaşlardan gelen acil durum bildirimleri</p>
        </div>
        <Badge className={reports.length > 0 ? 'border-red-200 bg-red-50 text-red-600' : 'border-avuc-green/20 bg-avuc-lightGreen text-avuc-success'}>
          {loading ? 'Yükleniyor...' : reports.length > 0 ? `${reports.length} aktif ihbar` : 'Aktif ihbar yok'}
        </Badge>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-avuc-muted">
          <Activity className="h-4 w-4 animate-pulse" />
          İhbarlar yükleniyor...
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-[2rem] border border-avuc-line bg-white p-8 shadow-soft text-center">
          <AlertOctagon className="mx-auto h-8 w-8 text-avuc-muted" />
          <p className="mt-3 text-sm font-bold text-avuc-text">Henüz aktif afet ihbarı bulunmuyor.</p>
          <p className="mt-1 text-xs text-avuc-muted">Acil bir durum varsa Acil Durum sayfasından ihbar oluşturabilirsiniz.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {display.map((r) => (
              <article key={r.id} className="card-hover flex flex-col gap-3 rounded-[1.5rem] border border-avuc-line bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <Badge className={classNames('border', getReportTypeColor(r.type))}>
                    {getReportTypeLabel(r.type)}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-avuc-muted">
                    <Clock className="h-3 w-3" />
                    {new Date(r.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-bold text-avuc-text leading-relaxed">{r.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 text-[11px] text-avuc-muted">
                  {r.city && (
                    <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
                      <MapPin className="h-3 w-3" />{r.city}{r.district ? ` / ${r.district}` : ''}
                    </span>
                  )}
                  {r.name && (
                    <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
                      <User className="h-3 w-3" />{r.name}
                    </span>
                  )}
                  {r.phone && (
                    <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
                      <Phone className="h-3 w-3" />{r.phone}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
          {reports.length > 3 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-avuc-line bg-slate-50 py-3 text-sm font-bold text-avuc-muted transition hover:bg-slate-100"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Daha az göster
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> Daha fazla göster ({reports.length - 3} ihbar)
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  )
}
