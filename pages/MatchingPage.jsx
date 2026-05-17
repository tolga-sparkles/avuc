import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/layout/Badge'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { api } from '@/services/api'
import { aidTypes } from '@/utils/constants'
import { cityFromLocation } from '@/utils/constants'
import { classNames } from '@/utils/classNames'

export default function MatchingPage({ onToast }) {
  const [selectedType, setSelectedType] = useState('Erzağım var, araç arıyorum')
  const [listings, setListings] = useState([])
  const [selectedListing, setSelectedListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/listings')
      .then(({ data }) => {
        const mapped = (data || []).map((listing) => ({
          ...listing,
          location: listing.location || `${listing.city} / ${listing.district}`,
          offered: listing.offered || listing.title || '-',
          needed: listing.needed || '-',
          availability: listing.availability || '-',
          capacity: listing.capacity || '-',
          urgency: listing.urgency || 'Orta',
          status: listing.status || 'Bekliyor',
        }))
        setListings(mapped)
        const firstMatch = mapped.find((l) => l.type === selectedType)
        setSelectedListing(firstMatch || mapped[0] || null)
      })
      .catch(() => onToast('İlanlar yüklenirken hata oluştu'))
      .finally(() => setLoading(false))
  }, [onToast, selectedType])

  const visibleListings = listings.filter((listing) => !selectedType || listing.type === selectedType)
  const suggestions = getSuggestions(selectedListing, listings)

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
              const firstMatch = listings.find((listing) => listing.type === type)
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
        {loading ? (
          <div className="flex items-center justify-center py-20 text-avuc-muted">Yükleniyor...</div>
        ) : (
          <>
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
                    <PrimaryButton onClick={() => onToast('Yakında')} className="mt-3 w-full min-h-10 py-2">Eşleşme öner</PrimaryButton>
                  </div>
                )) : (
                  <EmptyState title="Yakın öneri yok" description="Yeni araç, depo veya gönüllü ilanı geldiğinde burada görünecek." />
                )}
              </div>
            </aside>
          </>
        )}
      </div>
    </main>
  )
}

function getSuggestions(listing, allListings) {
  if (!listing) return []
  const city = cityFromLocation(listing.location)
  const sameCity = allListings.filter((item) => item.id !== listing.id && cityFromLocation(item.location) === city)

  if (listing.type.includes('Erzağım var')) {
    return sameCity.filter((item) => item.type.includes('Aracım var')).concat(allListings.filter((item) => item.type.includes('Aracım var') && item.id !== listing.id)).slice(0, 3)
  }

  if (listing.type.includes('Aracım var')) {
    return allListings.filter((item) => item.id !== listing.id && (item.type.includes('Erzağım var') || item.type.includes('Depom var') || item.type.includes('ihtiyaç bildiriyorum'))).slice(0, 3)
  }

  return sameCity.concat(allListings.filter((item) => item.id !== listing.id)).slice(0, 3)
}

function AidListingCard({ listing, selected, onSelect, onToast }) {
  return (
    <article className={classNames('card-hover rounded-[2rem] border bg-white p-5 shadow-soft', selected ? 'border-avuc-blue ring-4 ring-avuc-lightBlue' : 'border-avuc-line')}>
      <div className="flex items-start justify-between gap-3">
        <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">{listing.type}</Badge>
        <Badge className={listing.status === 'Tamamlandı' ? 'bg-avuc-lightGreen text-avuc-success border-avuc-success/20' : listing.status === 'Yardım yolda' ? 'bg-avuc-lightOrange text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}>{listing.status}</Badge>
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
        <PrimaryButton onClick={() => onToast('Yakında')} variant="light">Eşleşme öner</PrimaryButton>
      </div>
    </article>
  )
}
