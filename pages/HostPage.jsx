import { useState, useEffect } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { TextInput } from '@/components/layout/TextInput'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { Button } from '@/components/ui/button'
import { cities } from '@/data'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { classNames } from '@/utils/classNames'
import MapPicker from '@/components/MapPicker'
import ImageUploader from '@/components/ImageUploader'
import ListingPreview from '@/components/ListingPreview'
import { Eye, Save, Send, Loader2 } from 'lucide-react'

const STORAGE_KEY = 'avuc_host_draft'

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

function getDefaultExpiry() {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

export default function HostPage({ onToast, onLoginRequired }) {
  const draft = loadDraft()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: draft?.name || '',
    phone: draft?.phone || '',
    city: draft?.city || '',
    district: draft?.district || '',
    location: draft?.location || '',
    houseType: draft?.houseType || 'Oda',
    capacity: draft?.capacity || '',
    duration: draft?.duration || '',
    expiresAt: draft?.expiresAt || getDefaultExpiry(),
    gender: draft?.gender || 'Aile / karma',
    family: draft?.family ?? false,
    children: draft?.children ?? false,
    pets: draft?.pets ?? false,
    heating: draft?.heating ?? false,
    kitchen: draft?.kitchen ?? false,
    bathroom: draft?.bathroom ?? false,
    transport: draft?.transport ?? false,
    note: draft?.note || '',
  })
  const [mapPos, setMapPos] = useState(draft?.mapPos || null)
  const [images, setImages] = useState(draft?.images || [])
  const [showPreview, setShowPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const totalSteps = 3
  const progress = `${(step / totalSteps) * 100}%`
  const { isLoggedIn } = useAuth()

  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }))

  // Auto-save draft every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft({ ...formData, mapPos, images: images.map((img) => ({ id: img.id, preview: img.preview, name: img.name })) })
    }, 15000)
    return () => clearInterval(interval)
  }, [formData, mapPos, images])

  const buildPayload = (status = 'PENDING') => ({
    type: 'shelter',
    category: 'Kalacak yer sunuyorum',
    city: formData.city,
    district: formData.district,
    location: formData.location,
    title: `${formData.city} / ${formData.district}`,
    description: formData.note,
    capacity: Number(formData.capacity) || 0,
    duration: formData.duration,
    status,
    lat: mapPos?.lat,
    lng: mapPos?.lng,
    expiresAt: formData.expiresAt || undefined,
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    const payload = buildPayload('PENDING')
    setSubmitting(true)
    try {
      await api.post('/listings', payload)
      onToast('Barınma ilanı admin onayına gönderildi')
      setStep(1)
      setFormData({
        name: '', phone: '', city: '', district: '', location: '',
        houseType: 'Oda', capacity: '', duration: '', expiresAt: getDefaultExpiry(),
        gender: 'Aile / karma', family: false, children: false, pets: false, heating: false,
        kitchen: false, bathroom: false, transport: false, note: '',
      })
      setMapPos(null)
      setImages([])
      setShowPreview(false)
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      onToast('İlan gönderilirken hata oluştu')
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
    setSubmitting(true)
    try {
      await api.post('/listings', payload)
      onToast('Taslak kaydedildi')
      saveDraft({ ...formData, mapPos, images })
    } catch {
      onToast('Taslak kaydedilirken hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Barınma desteği"
        title="Evimi Açmak İstiyorum"
        description="Form kısa adımlara ayrılmıştır. Harita üzerinden konum seçebilir, fotoğraf ekleyebilir ve önizleme yapabilirsiniz."
      />
      <form
        className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft sm:p-7"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-avuc-muted">
            <span>Adım {step} / {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-avuc-blue transition-all" style={{ width: progress }} />
          </div>
        </div>

        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Ad soyad" placeholder="Adınız Soyadınız" required value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
            <TextInput label="Telefon" placeholder="05xx xxx xx xx" required value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} type="tel" inputMode="tel" autoComplete="tel" />
            <TextInput label="Şehir" as="select" required value={formData.city} onChange={(e) => updateField('city', e.target.value)}>
              <option value="">Şehir seçin</option>
              {cities.map((city) => <option key={city}>{city}</option>)}
            </TextInput>
            <TextInput label="İlçe" placeholder="Şahinbey" required value={formData.district} onChange={(e) => updateField('district', e.target.value)} />
            <TextInput className="sm:col-span-2" label="Açık adres ya da yaklaşık konum" placeholder="Mahalle, cadde veya güvenli yakın konum" required value={formData.location} onChange={(e) => updateField('location', e.target.value)} />
            <div className="sm:col-span-2">
              <MapPicker value={mapPos} onChange={setMapPos} label="Harita üzerinden konum seçin (tıklayın)" />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Ev tipi" as="select" required value={formData.houseType} onChange={(e) => updateField('houseType', e.target.value)}>
              <option>Oda</option>
              <option>Tüm ev</option>
              <option>Yazlık</option>
              <option>Apart</option>
              <option>Misafirhane</option>
            </TextInput>
            <TextInput label="Kaç kişi kalabilir?" type="number" min="1" placeholder="3" required value={formData.capacity} onChange={(e) => updateField('capacity', e.target.value)} />
            <TextInput label="Kaç gün kalabilirler?" type="number" min="1" placeholder="7" required value={formData.duration} onChange={(e) => updateField('duration', e.target.value)} />
            <TextInput label="İlan süresi (son tarih)" type="date" value={formData.expiresAt} onChange={(e) => updateField('expiresAt', e.target.value)} />
            <TextInput label="Kadın / erkek / karma uygunluğu" as="select" required value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
              <option>Aile / karma</option>
              <option>Kadın</option>
              <option>Erkek</option>
              <option>Çocuklu aile</option>
            </TextInput>
            <div className="sm:col-span-2">
              <ImageUploader images={images} onChange={setImages} maxImages={5} maxSizeMB={5} />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['family', 'Aileye uygun mu?'],
                ['children', 'Çocuklu aileye uygun mu?'],
                ['pets', 'Evcil hayvan kabul ediyor mu?'],
                ['heating', 'Isınma var mı?'],
                ['kitchen', 'Mutfak kullanılabilir mi?'],
                ['bathroom', 'Banyo kullanılabilir mi?'],
                ['transport', 'Ulaşım imkanı var mı?'],
              ].map(([key, label]) => (
                <label key={label} className="flex items-center justify-between rounded-2xl border border-avuc-line bg-slate-50 px-4 py-3 text-sm font-bold text-avuc-text">
                  {label}
                  <input type="checkbox" className="h-5 w-5 accent-avuc-blue" checked={formData[key]} onChange={(e) => updateField(key, e.target.checked)} />
                </label>
              ))}
            </div>
            <TextInput label="Ek açıklama" as="textarea" rows="5" placeholder="Evdeki imkanlar, özel koşullar ve ulaşım notları" value={formData.note} onChange={(e) => updateField('note', e.target.value)} />
            {showPreview && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-avuc-text">İlan Önizlemesi</h3>
                  <Button variant="neutral" size="sm" className="rounded-2xl" onClick={() => setShowPreview(false)}>Kapat</Button>
                </div>
                <ListingPreview
                  data={buildPayload('PENDING')}
                  categoryLabel="Kalacak yer sunuyorum"
                  images={images}
                />
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <PrimaryButton variant="light" onClick={() => setStep((current) => Math.max(1, current - 1))} className={step === 1 ? 'invisible' : ''}>Geri</PrimaryButton>
          {step < totalSteps ? (
            <PrimaryButton onClick={() => setStep((current) => Math.min(totalSteps, current + 1))}>Devam et</PrimaryButton>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryButton type="button" variant="light" onClick={() => setShowPreview(true)}>
                <Eye className="mr-2 inline h-4 w-4" />
                Önizle
              </PrimaryButton>
              <PrimaryButton type="button" variant="light" onClick={handleDraft} disabled={submitting}>
                <Save className="mr-2 inline h-4 w-4" />
                Taslak kaydet
              </PrimaryButton>
              <PrimaryButton type="submit" variant="green" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : <Send className="mr-2 inline h-4 w-4" />}
                İlanı yayınla
              </PrimaryButton>
            </div>
          )}
        </div>
      </form>
    </main>
  )
}
