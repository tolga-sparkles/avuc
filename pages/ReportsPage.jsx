import { useState } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/layout/Badge'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import DisasterReportsSection from '@/components/DisasterReportsSection'
import { useDisasterReports } from '@/hooks/useDisasterReports'
import { api } from '@/services/api'
import { classNames } from '@/utils/classNames'
import { AlertTriangle, Send, Loader2, X } from 'lucide-react'

const reportTypes = [
  { id: 'earthquake', label: 'Deprem', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'fire', label: 'Yangın', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'flood', label: 'Sel', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'landslide', label: 'Heyelan', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'storm', label: 'Fırtına', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'avalanche', label: 'Çığ', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'other', label: 'Diğer', color: 'bg-slate-100 text-slate-700 border-slate-200' },
]

function ReportForm({ onClose, onSubmitted }) {
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!type || !description) return

    setSubmitting(true)
    try {
      await api.post('/reports', {
        type,
        description,
        city: city || undefined,
        district: district || undefined,
        name: name || undefined,
        phone: phone || undefined,
      })
      onSubmitted()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || 'İhbar gönderilemedi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-avuc-text">Yeni Afet İhbarı</h3>
            <p className="mt-1 text-xs text-avuc-muted">Konumunuzu ve durumu kısa ve net anlatın.</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-slate-200">
            <X className="h-5 w-5 text-avuc-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-avuc-text">Afet Türü</label>
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={classNames(
                    'rounded-xl border px-3 py-2 text-xs font-bold transition',
                    type === t.id ? t.color : 'border-avuc-line bg-slate-50 text-avuc-muted hover:bg-slate-100',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-avuc-text">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              placeholder="Ne oldu, nerede, kaç kişi etkilendi?"
              className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-avuc-text">Şehir</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Hatay"
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-avuc-text">İlçe</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Antakya"
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-avuc-text">Adınız (opsiyonel)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsim Soyisim"
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-avuc-text">Telefon (opsiyonel)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xx xxx xx xx" type="tel" inputMode="tel" autoComplete="tel"
                className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow transition placeholder:text-slate-500 focus:border-border"
              />
            </div>
          </div>

          <PrimaryButton type="submit" disabled={submitting || !type || !description} className="w-full">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send className="h-4 w-4" /> İhbar Gönder
              </span>
            )}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const { reports, loading, error, refetch } = useDisasterReports()
  const [showForm, setShowForm] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmitted = () => {
    setSubmitMessage('İhbarınız alındı. Admin onayından sonra yayınlanacak.')
    refetch()
    setTimeout(() => setSubmitMessage(''), 5000)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Canlı ihbar"
          title="Anlık Afet İhbarları"
          description="Vatandaşlardan gelen acil durum bildirimleri. En yeni ihbarlar en üsttedir."
        />
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-[20px] bg-avuc-red px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-red-600"
        >
          <AlertTriangle className="h-4 w-4" />
          Yeni İhbar Gönder
        </button>
      </div>

      {submitMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          {submitMessage}
        </div>
      )}

      <DisasterReportsSection reports={reports} loading={loading} error={error} />

      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmitted={handleSubmitted} />}
    </main>
  )
}
