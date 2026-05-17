import { MapPin, Users, Clock, Shield, Check, Phone } from 'lucide-react'
import { classNames } from '@/utils/classNames'

export default function ListingPreview({ data, categoryLabel, images = [] }) {
  const {
    city = '',
    district = '',
    title = '',
    description = '',
    capacity = '',
    duration = '',
    lat,
    lng,
    amenities = [],
  } = data

  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-avuc-lightBlue px-3 py-1 text-xs font-bold text-avuc-darkBlue">Önizleme</span>
        <span className="rounded-full border border-avuc-line bg-slate-50 px-3 py-1 text-xs font-bold text-avuc-muted">{categoryLabel}</span>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.slice(0, 3).map((img, i) => (
            <div key={img.id} className={classNames('aspect-square overflow-hidden rounded-2xl bg-slate-100', i === 0 ? 'col-span-2 row-span-2' : '')}>
              <img src={img.preview} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50">
          <p className="text-sm font-bold text-avuc-muted">Henüz fotoğraf yüklenmedi</p>
        </div>
      )}

      <h3 className="mt-4 text-xl font-black text-avuc-text">{title || `${city} / ${district}`}</h3>
      <p className="mt-2 text-sm leading-6 text-avuc-muted">{description || 'Açıklama girilmedi.'}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {city && (
          <span className="inline-flex items-center gap-1 rounded-full border border-avuc-line bg-slate-50 px-3 py-1 text-xs font-bold text-avuc-muted">
            <MapPin className="h-3 w-3" /> {city} / {district}
          </span>
        )}
        {capacity && (
          <span className="inline-flex items-center gap-1 rounded-full border border-avuc-line bg-slate-50 px-3 py-1 text-xs font-bold text-avuc-muted">
            <Users className="h-3 w-3" /> {capacity} kişi
          </span>
        )}
        {duration && (
          <span className="inline-flex items-center gap-1 rounded-full border border-avuc-line bg-slate-50 px-3 py-1 text-xs font-bold text-avuc-muted">
            <Clock className="h-3 w-3" /> {duration}
          </span>
        )}
        {lat && lng && (
          <span className="inline-flex items-center gap-1 rounded-full border border-avuc-green/20 bg-avuc-lightGreen px-3 py-1 text-xs font-bold text-avuc-success">
            <Shield className="h-3 w-3" /> Konum seçildi
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-avuc-muted">A</div>
        <div>
          <p className="text-xs font-bold text-avuc-text">Admin onayına gönderilecek</p>
          <p className="text-[11px] text-avuc-muted">Ortalama onay süresi 15 dk</p>
        </div>
      </div>
    </div>
  )
}
