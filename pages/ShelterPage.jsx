import { useEffect, useState } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { TextInput } from '@/components/layout/TextInput'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { Badge } from '@/components/layout/Badge'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import { cities } from '@/data'
import { classNames } from '@/utils/classNames'

export default function ShelterPage({ onNavigate, onToast }) {
  const [filters, setFilters] = useState({ city: '', district: '', capacity: '', family: false, children: false, pets: false, disabled: false, transport: false, verified: false })
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/listings?type=shelter')
      .then(({ data }) => {
        const mapped = (data || []).map((listing) => ({
          ...listing,
          family: listing.family ?? false,
          children: listing.children ?? false,
          pets: listing.pets ?? false,
          disabled: listing.disabled ?? false,
          transport: listing.transport ?? false,
          hostScore: listing.hostScore ?? 4.5,
          gender: listing.gender ?? 'Aile / karma',
          type: listing.type ?? 'Oda',
          note: listing.description || listing.note || '',
          amenities: typeof listing.amenities === 'string' ? JSON.parse(listing.amenities) : (listing.amenities || []),
        }))
        setListings(mapped)
      })
      .catch(() => onToast('Barınma ilanları yüklenirken hata oluştu'))
      .finally(() => setLoading(false))
  }, [onToast])

  const filteredShelters = listings.filter((listing) => {
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
          {loading ? (
            <div className="flex items-center justify-center py-20 text-avuc-muted">Yükleniyor...</div>
          ) : filteredShelters.length ? (
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
        <PrimaryButton onClick={() => onToast('Yakında')} className="flex-1">İletişime geç</PrimaryButton>
        <PrimaryButton onClick={() => onToast('Yakında')} variant="light" className="flex-1">İlanı bildir</PrimaryButton>
      </div>
    </article>
  )
}
