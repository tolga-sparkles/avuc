import { useState, useEffect, useRef } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/layout/Badge'
import { TextInput } from '@/components/layout/TextInput'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { Button } from '@/components/ui/button'
import { createCategories, cities } from '@/data'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { classNames } from '@/utils/classNames'
import MapPicker from '@/components/MapPicker'
import ImageUploader from '@/components/ImageUploader'
import ListingPreview from '@/components/ListingPreview'
import { Eye, Save, Send, Loader2, Home, Search, Truck, Package, Warehouse, HeartHandshake, AlertTriangle } from 'lucide-react'

const STORAGE_KEY = 'avuc_listing_draft'

function getDefaultExpiry() {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }))
  } catch {}
}

function categoryStyle(cat) {
  switch (cat) {
    case 'Kalacak yer sunuyorum':
      return { icon: Home, bg: 'bg-[#e8f0fe] hover:bg-[#d2e3fc]', text: 'text-[#1a4fc4]', ring: 'ring-[#1a4fc4]' }
    case 'Kalacak yer arıyorum':
      return { icon: Search, bg: 'bg-[#e6fdf5] hover:bg-[#cbfbe7]', text: 'text-[#0fa968]', ring: 'ring-[#0fa968]' }
    case 'Aracım var':
      return { icon: Truck, bg: 'bg-[#fff4e6] hover:bg-[#ffe8cc]', text: 'text-[#b76e00]', ring: 'ring-[#b76e00]' }
    case 'Erzağım var':
      return { icon: Package, bg: 'bg-[#f3e8ff] hover:bg-[#e9d5ff]', text: 'text-[#6b21a8]', ring: 'ring-[#6b21a8]' }
    case 'Depom var':
      return { icon: Warehouse, bg: 'bg-[#ffe4e6] hover:bg-[#fecdd3]', text: 'text-[#be123c]', ring: 'ring-[#be123c]' }
    case 'Gönüllüyüm':
      return { icon: HeartHandshake, bg: 'bg-[#e0f2fe] hover:bg-[#bae6fd]', text: 'text-[#0369a1]', ring: 'ring-[#0369a1]' }
    case 'Acil ihtiyaç bildiriyorum':
      return { icon: AlertTriangle, bg: 'bg-[#fee2e2] hover:bg-[#fecaca]', text: 'text-[#dc2626]', ring: 'ring-[#dc2626]' }
    default:
      return { icon: Home, bg: 'bg-slate-100 hover:bg-slate-200', text: 'text-slate-700', ring: 'ring-slate-400' }
  }
}

export default function CreateListingPage({ onToast, onLoginRequired }) {
  const draft = loadDraft()
  const [category, setCategory] = useState(draft?.category || 'Kalacak yer sunuyorum')
  const [mapPos, setMapPos] = useState(draft?.mapPos || null)
  const [images, setImages] = useState(draft?.images || [])
  const [showPreview, setShowPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewData, setPreviewData] = useState({})
  const { isLoggedIn } = useAuth()
  const formRef = useRef(null)

  const categoryFields = getCategoryFields(category)

  const getTypeFromCategory = (cat) => {
    if (cat === 'Kalacak yer sunuyorum') return 'shelter'
    if (cat === 'Kalacak yer arıyorum') return 'shelter_request'
    if (cat === 'Aracım var') return 'vehicle'
    if (cat === 'Erzağım var') return 'food'
    if (cat === 'Depom var') return 'depot'
    if (cat === 'Gönüllüyüm') return 'volunteer'
    return 'urgent'
  }

  // Auto-save draft every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!formRef.current) return
      const fd = new FormData(formRef.current)
      saveDraft({
        category,
        mapPos,
        images: images.map((img) => ({ id: img.id, preview: img.preview, name: img.name })),
        name: fd.get('name'),
        phone: fd.get('phone'),
        city: fd.get('city'),
        district: fd.get('district'),
        title: fd.get('title'),
        description: fd.get('description'),
        capacity: fd.get('capacity'),
        duration: fd.get('duration'),
        expiresAt: fd.get('expiresAt'),
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [category, mapPos, images])

  const buildPayload = (status = 'PENDING') => {
    const form = formRef.current
    if (!form) return null
    const fd = new FormData(form)
    const data = {
      type: getTypeFromCategory(category),
      category,
      city: fd.get('city') || '',
      district: fd.get('district') || '',
      location: fd.get('district') || '',
      title: fd.get('title') || `${category} - ${fd.get('city') || ''}`,
      description: fd.get('description') || '',
      capacity: Number(fd.get('capacity')) || undefined,
      duration: fd.get('duration') || '',
      status,
      lat: mapPos?.lat,
      lng: mapPos?.lng,
      expiresAt: fd.get('expiresAt') || undefined,
    }
    // Add dynamic fields
    categoryFields.forEach((field) => {
      const val = fd.get(field.label)
      if (val) data[field.label] = val
    })
    return data
  }

  const handlePreview = () => {
    const data = buildPayload('PENDING')
    if (!data) return
    setPreviewData(data)
    setShowPreview(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    const payload = buildPayload('PENDING')
    if (!payload) return
    setSubmitting(true)
    try {
      await api.post('/listings', payload)
      onToast(`${category} ilanı admin onayına gönderildi`)
      formRef.current.reset()
      setMapPos(null)
      setImages([])
      setShowPreview(false)
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      if (error.response?.status === 401) {
        onLoginRequired()
      } else {
        onToast('İlan gönderilirken hata oluştu')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDraft = async () => {
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    const payload = buildPayload('DRAFT')
    if (!payload) return
    setSubmitting(true)
    try {
      await api.post('/listings', payload)
      onToast('Taslak kaydedildi')
      saveDraft({ category, mapPos, images })
    } catch {
      onToast('Taslak kaydedilirken hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="İlan oluşturma akışı"
        title="Önce kategori seçin"
        description="Seçilen kategoriye göre ilgili kısa form açılır. Harita üzerinden konum seçebilir ve fotoğraf ekleyebilirsiniz."
      />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="flex h-fit gap-2 overflow-x-auto rounded-[2rem] border border-avuc-line bg-white p-3 shadow-soft lg:grid lg:gap-3 lg:overflow-visible lg:p-4">
          {createCategories.map((item) => {
            const isActive = category === item
            const cfg = categoryStyle(item)
            const Icon = cfg.icon
            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={classNames(
                  'inline-flex shrink-0 items-center gap-2 rounded-[20px] px-4 py-3 text-left text-sm font-semibold transition-all duration-200 lg:w-full lg:gap-3.5 lg:px-5 lg:py-[16px]',
                  isActive ? 'ring-2 ring-offset-2 ' + cfg.ring : '',
                  cfg.bg,
                  cfg.text
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="whitespace-nowrap">{item}</span>
              </button>
            )
          })}
        </aside>

        <div className="space-y-6">
          <form
            ref={formRef}
            className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft sm:p-7"
            onSubmit={handleSubmit}
          >
            <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">{category}</Badge>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TextInput name="name" label="Ad soyad" placeholder="Adınız Soyadınız" defaultValue={draft?.name || ''} required />
              <TextInput name="phone" label="Telefon" placeholder="05xx xxx xx xx" defaultValue={draft?.phone || ''} required type="tel" inputMode="tel" autoComplete="tel" />
              <TextInput name="city" label="Şehir" as="select" defaultValue={draft?.city || ''} required>
                <option value="">Şehir seçin</option>
                {cities.map((city) => <option key={city}>{city}</option>)}
              </TextInput>
              <TextInput name="district" label="İlçe / konum" placeholder="Merkez" defaultValue={draft?.district || ''} required />
              <TextInput name="title" label="İlan başlığı" placeholder="Kısa ve açıklayıcı başlık" defaultValue={draft?.title || ''} className="sm:col-span-2" />
              {categoryFields.map((field) => (
                <TextInput key={field.label} name={field.label} label={field.label} as={field.type === 'textarea' ? 'textarea' : field.type === 'select' ? 'select' : 'input'} rows={field.type === 'textarea' ? 4 : undefined} placeholder={field.placeholder} required={field.required} defaultValue={draft?.[field.label] || ''}>
                  {field.options?.map((option) => <option key={option}>{option}</option>)}
                </TextInput>
              ))}
              <TextInput name="duration" label="İlan süresi (gün)" type="number" min="1" max="30" placeholder="14" defaultValue={draft?.duration || '14'} />
              <TextInput name="expiresAt" label="Son geçerlilik tarihi" type="date" defaultValue={draft?.expiresAt || getDefaultExpiry()} />
              <div className="sm:col-span-2">
                <MapPicker value={mapPos} onChange={setMapPos} label="Harita üzerinden konum seçin (tıklayın)" />
              </div>
              <div className="sm:col-span-2">
                <ImageUploader images={images} onChange={setImages} maxImages={5} maxSizeMB={5} />
              </div>
              <TextInput name="description" className="sm:col-span-2" label="Ek açıklama" as="textarea" rows="4" placeholder="Kısa ve net bilgi yazın" defaultValue={draft?.description || ''} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton type="submit" className="flex-1" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : <Send className="mr-2 inline h-4 w-4" />}
                İlanı gönder
              </PrimaryButton>
              <PrimaryButton variant="light" className="flex-1" type="button" onClick={handlePreview}>
                <Eye className="mr-2 inline h-4 w-4" />
                Önizle
              </PrimaryButton>
              <PrimaryButton variant="light" className="flex-1" type="button" onClick={handleDraft} disabled={submitting}>
                <Save className="mr-2 inline h-4 w-4" />
                Taslak kaydet
              </PrimaryButton>
            </div>
          </form>

          {showPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-avuc-text">İlan Önizlemesi</h3>
                <Button variant="neutral" size="sm" className="rounded-2xl" onClick={() => setShowPreview(false)}>Kapat</Button>
              </div>
              <ListingPreview data={previewData} categoryLabel={category} images={images} />
              <PrimaryButton className="w-full" onClick={() => { setShowPreview(false); formRef.current?.requestSubmit() }}>
                <Send className="mr-2 inline h-4 w-4" />
                Onaylıyorum, İlanı Gönder
              </PrimaryButton>
            </div>
          )}
        </div>
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
