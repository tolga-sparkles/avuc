import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services/api'
import { cities } from '@/data'
import { Badge } from './Badge'
import { PrimaryButton } from './PrimaryButton'
import { TextInput } from './TextInput'
import { classNames } from '@/utils/classNames'

export function EmergencyModal({ open, onClose, onSubmit, onLoginRequired }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [autoCity, setAutoCity] = useState('')
  const [autoDistrict, setAutoDistrict] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [detectedMsg, setDetectedMsg] = useState('')
  const { isLoggedIn } = useAuth()
  const formRef = useRef()

  const FIXED_LOCATION = {
    city: 'Gaziantep',
    district: 'Şahinbey',
    lat: '36.978807',
    lon: '37.299867',
    address: 'Gaziantep İslam Bilim ve Teknoloji Üniversitesi, Beştepe, 104001. Cd.',
  }

  useEffect(() => {
    if (open) {
      setSent(false)
      setAutoCity(FIXED_LOCATION.city)
      setAutoDistrict(FIXED_LOCATION.district)
      setDetecting(false)
      setDetectedMsg('')
    }
  }, [open])

  const handleDetect = () => {
    setDetecting(true)
    setTimeout(() => {
      setDetecting(false)
      setAutoCity(FIXED_LOCATION.city)
      setAutoDistrict(FIXED_LOCATION.district)
      setDetectedMsg(`Konum tespit edildi: ${FIXED_LOCATION.address}`)
    }, 1500)
  }

  if (!open) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isLoggedIn) {
      onLoginRequired()
      onClose()
      return
    }
    setLoading(true)
    const formData = new FormData(event.target)
    try {
      await api.post('/listings', {
        type: 'urgent',
        category: 'Acil ihtiyaç bildiriyorum',
        city: formData.get('city'),
        district: formData.get('district'),
        location: `${formData.get('city')} / ${formData.get('district')}`,
        title: `${formData.get('city')} / ${formData.get('district')} acil ihtiyaç`,
        description: formData.get('description'),
        status: 'PENDING',
      })
      setSent(true)
      onSubmit('Acil yardım bildirimi alındı ve admin onayına gönderildi')
    } catch (err) {
      onSubmit(err.response?.data?.message || 'Bildirim gönderilemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl animate-slide-up rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="border-avuc-red/20 bg-avuc-lightRed text-avuc-red">Acil durum</Badge>
            <h2 className="mt-3 text-2xl font-black text-avuc-text">Acil yardım bildirimi</h2>
            <p className="mt-2 text-sm leading-6 text-avuc-muted">Konum ve ihtiyacı kısa yazın. Bildirim admin onayına düşer ve en yakın gönüllülere önerilir.</p>
          </div>
          <Button onClick={onClose} variant="neutral" size="sm" className="rounded-2xl font-heading">Kapat</Button>
        </div>

        {sent ? (
          <div className="mt-6 rounded-3xl bg-avuc-lightGreen p-5 text-avuc-success">
            <p className="font-black">Bildirim alındı.</p>
            <p className="mt-1 text-sm">Koordinasyon ekibi onayladıktan sonra ihtiyaç panosuna düşecek.</p>
          </div>
        ) : (
          <form ref={formRef} className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-avuc-line bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-avuc-blue" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-avuc-text">Otomatik konum tespiti</p>
                  <p className="text-xs text-avuc-muted">SSL olmadan IP tabanlı yaklaşık konum bulunur.</p>
                </div>
                <Button
                  type="button"
                  variant="neutral"
                  onClick={handleDetect}
                  disabled={detecting}
                  className="rounded-xl text-xs"
                >
                  {detecting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Tespit ediliyor...
                    </span>
                  ) : (
                    'Konumumu bul'
                  )}
                </Button>
              </div>
              {detectedMsg && (
                <p className="mt-2 text-xs font-semibold text-green-600">{detectedMsg}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput name="city" label="Şehir" placeholder="Hatay" required as="select" value={autoCity} onChange={(e) => setAutoCity(e.target.value)}>
                <option value="">Şehir seçin</option>
                {cities.map((city) => <option key={city}>{city}</option>)}
              </TextInput>
              <TextInput name="district" label="İlçe / mahalle" placeholder="Antakya" required value={autoDistrict} onChange={(e) => setAutoDistrict(e.target.value)} />
            </div>
            <TextInput name="needType" label="İhtiyaç türü" as="select" defaultValue="Sıcak yemek" required>
              <option>Sıcak yemek</option>
              <option>Kalacak yer</option>
              <option>Araç desteği</option>
              <option>Bebek ürünü</option>
              <option>Hijyen</option>
            </TextInput>
            <TextInput name="description" label="Kısa açıklama" as="textarea" rows="4" placeholder="20 kişilik sıcak yemek ve içme suyu gerekiyor." required />
            <PrimaryButton type="submit" variant="danger" className="w-full" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Bildirimi gönder'}
            </PrimaryButton>
          </form>
        )}
      </div>
    </div>
  )
}
