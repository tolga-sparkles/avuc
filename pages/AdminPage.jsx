import { useEffect, useState } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { TextInput } from '@/components/layout/TextInput'
import { Badge } from '@/components/layout/Badge'
import { api } from '@/services/api'
import { disasterZones } from '@/data'
import { getUrgencyClass } from '@/utils/constants'
import { classNames } from '@/utils/classNames'
import { getReportTypeLabel, getReportTypeColor } from '@/components/DisasterReportsSection'
import { MapPin, Clock, User, Phone, CheckCircle, Trash2, X } from 'lucide-react'

export default function AdminPage({ onToast }) {
  const [stats, setStats] = useState({})
  const [pending, setPending] = useState([])
  const [reports, setReports] = useState([])
  const [disasterReports, setDisasterReports] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [statsRes, pendingRes, reportsRes, disasterRes, donationsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: {} })),
        api.get('/admin/pending-listings').catch(() => ({ data: [] })),
        api.get('/admin/reports').catch(() => ({ data: [] })),
        api.get('/reports/admin/all').catch(() => ({ data: { data: [] } })),
        api.get('/donations').catch(() => ({ data: [] })),
      ])
      setStats(statsRes.data || {})
      setPending(pendingRes.data || [])
      setReports(reportsRes.data || [])
      setDisasterReports(disasterRes.data?.data || [])
      setDonations(donationsRes.data || [])
    } catch {
      onToast('Admin verileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [onToast])

  const handleApprove = async (id) => {
    try {
      await api.patch(`/listings/${id}/status`, { status: 'APPROVED' })
      setPending((current) => current.filter((item) => item.id !== id))
      onToast('İlan onaylandı')
    } catch {
      onToast('İlan onaylanırken hata oluştu')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.patch(`/listings/${id}/status`, { status: 'REJECTED' })
      setPending((current) => current.filter((item) => item.id !== id))
      onToast('İlan reddedildi')
    } catch {
      onToast('İlan reddedilirken hata oluştu')
    }
  }

  const handleResolveReport = async (id) => {
    try {
      await api.post(`/admin/reports/${id}/resolve`)
      setReports((current) => current.filter((item) => item.id !== id))
      onToast('Şikayet incelenmiş olarak kapatıldı')
    } catch {
      onToast('Şikayet kapatılırken hata oluştu')
    }
  }

  const handleApproveDisaster = async (id) => {
    try {
      await api.patch(`/reports/${id}/approve`)
      setDisasterReports((current) => current.map((item) => item.id === id ? { ...item, status: 'ACTIVE' } : item))
      onToast('Afet ihbarı onaylandı ve yayınlandı')
    } catch {
      onToast('İhbar onaylanırken hata oluştu')
    }
  }

  const handleRejectDisaster = async (id) => {
    try {
      await api.patch(`/reports/${id}/reject`)
      setDisasterReports((current) => current.map((item) => item.id === id ? { ...item, status: 'REJECTED' } : item))
      onToast('Afet ihbarı reddedildi')
    } catch {
      onToast('İhbar reddedilirken hata oluştu')
    }
  }

  const handleDeleteDisaster = async (id) => {
    if (!confirm('Bu afet ihbarını kalıcı olarak silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/reports/${id}`)
      setDisasterReports((current) => current.filter((item) => item.id !== id))
      onToast('İhbar silindi')
    } catch {
      onToast('İhbar silinirken hata oluştu')
    }
  }

  const pendingCount = stats.pendingListings ?? pending.length
  const reportCount = stats.reports ?? reports.length
  const zoneCount = stats.activeZones ?? disasterZones.length
  const donationCount = stats.trackingDonations ?? donations.length
  const pendingDisasterCount = disasterReports.filter((r) => r.status === 'PENDING').length

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Admin"
        title="Sade yönetim paneli"
        description="Bekleyen ilanlar, şikayetler, bağış takibi, kullanıcı doğrulamaları ve gönüllü görevleri tek ekrandan yönetilir."
      />
      {loading ? (
        <div className="flex items-center justify-center py-20 text-avuc-muted">Yükleniyor...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              ['Bekleyen ilan', pendingCount],
              ['Sahte ilan raporu', reportCount],
              ['Onay bekleyen ihbar', pendingDisasterCount],
              ['Aktif afet bölgesi', zoneCount],
              ['Takipte bağış', donationCount],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-avuc-line bg-white p-5 shadow-soft">
                <p className="text-3xl font-black text-avuc-text">{value}</p>
                <p className="mt-1 text-sm font-bold text-avuc-muted">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <AdminPanel title="Bekleyen ilanları onayla / reddet">
              {pending.length ? pending.map((item) => (
                <div key={item.id} className="rounded-2xl border border-avuc-line bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-avuc-text">{item.title}</p>
                      <p className="mt-1 text-sm text-avuc-muted">{item.owner} · {item.type} · {item.status}</p>
                    </div>
                    <Badge className="border-avuc-orange/20 bg-avuc-lightOrange text-amber-700">Bekliyor</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <PrimaryButton onClick={() => handleApprove(item.id)} variant="green" className="min-h-10 flex-1 py-2">Onayla</PrimaryButton>
                    <PrimaryButton onClick={() => handleReject(item.id)} variant="danger" className="min-h-10 flex-1 py-2">Reddet</PrimaryButton>
                  </div>
                </div>
              )) : <EmptyState title="Bekleyen ilan yok" description="Yeni ilanlar geldiğinde burada listelenecek." />}
            </AdminPanel>

            <AdminPanel title="Sahte ilanları kaldır">
              {reports.map((report) => (
                <div key={report.id} className="rounded-2xl border border-avuc-line bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-avuc-text">{report.title}</p>
                      <p className="mt-1 text-sm text-avuc-muted">{report.reason}</p>
                    </div>
                    <Badge className={getUrgencyClass(report.priority)}>{report.priority}</Badge>
                  </div>
                  <PrimaryButton onClick={() => handleResolveReport(report.id)} variant="light" className="mt-4 w-full min-h-10 py-2">İncele ve kapat</PrimaryButton>
                </div>
              ))}
            </AdminPanel>

            <AdminPanel title={`Afet İhbarları Yönetimi (${disasterReports.filter(r => r.status === 'PENDING').length} onay bekliyor)`}>
              {disasterReports.length ? disasterReports.map((r) => (
                <div key={r.id} className={classNames('rounded-2xl border p-4', r.status === 'PENDING' ? 'border-amber-200 bg-amber-50/40' : r.status === 'REJECTED' ? 'border-red-200 bg-red-50/30' : 'border-avuc-line bg-slate-50')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={classNames('border', getReportTypeColor(r.type))}>
                          {getReportTypeLabel(r.type)}
                        </Badge>
                        <Badge className={classNames('border', r.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' : r.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200')}>
                          {r.status === 'PENDING' ? 'Onay Bekliyor' : r.status === 'ACTIVE' ? 'Yayında' : 'Reddedildi'}
                        </Badge>
                        <span className="text-[11px] text-avuc-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(r.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-avuc-text">{r.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-avuc-muted">
                        {r.city && (
                          <span className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 border border-avuc-line">
                            <MapPin className="h-3 w-3" />{r.city}{r.district ? ` / ${r.district}` : ''}
                          </span>
                        )}
                        {r.name && (
                          <span className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 border border-avuc-line">
                            <User className="h-3 w-3" />{r.name}
                          </span>
                        )}
                        {r.phone && (
                          <span className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 border border-avuc-line">
                            <Phone className="h-3 w-3" />{r.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {r.status === 'PENDING' && (
                    <div className="mt-3 flex gap-2">
                      <PrimaryButton onClick={() => handleApproveDisaster(r.id)} variant="green" className="min-h-9 flex-1 py-2 text-xs">
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Onayla ve Yayınla
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleRejectDisaster(r.id)} variant="danger" className="min-h-9 flex-1 py-2 text-xs">
                        <X className="mr-1.5 h-3.5 w-3.5" /> Reddet
                      </PrimaryButton>
                    </div>
                  )}
                  {r.status !== 'PENDING' && (
                    <div className="mt-3 flex gap-2">
                      <PrimaryButton onClick={() => handleDeleteDisaster(r.id)} variant="light" className="min-h-9 w-full py-2 text-xs">
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Sil
                      </PrimaryButton>
                    </div>
                  )}
                </div>
              )) : <EmptyState title="Afet ihbarı yok" description="Vatandaşlardan gelen ihbarlar burada listelenecek." />}
            </AdminPanel>

            <AdminPanel title="Acil ihtiyaç ve afet bölgesi ekle">
              <form className="grid gap-3" onSubmit={(event) => {
                event.preventDefault()
                onToast('Yakında')
              }}>
                <TextInput label="Konum" placeholder="Hatay / Antakya" />
                <TextInput label="İhtiyaç" placeholder="20 kişilik sıcak yemek" />
                <TextInput label="Durum" as="select"><option>Acil</option><option>Yardım bekliyor</option><option>Yardım yolda</option></TextInput>
                <PrimaryButton type="submit">Ekle</PrimaryButton>
              </form>
            </AdminPanel>

            <AdminPanel title="Bağışları ve doğrulamaları takip et">
              <div className="grid gap-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-black text-avuc-text">{donation.package}</p>
                    <p className="mt-1 font-semibold text-avuc-muted">{donation.donor} · {donation.status}</p>
                  </div>
                ))}
                <div className="grid gap-2 sm:grid-cols-2">
                  <PrimaryButton variant="light" onClick={() => onToast('Yakında')}>Kullanıcı doğrulamaları</PrimaryButton>
                  <PrimaryButton variant="light" onClick={() => onToast('Yakında')}>Gönüllü görevi oluştur</PrimaryButton>
                  <PrimaryButton variant="light" onClick={() => onToast('Yakında')}>Tamamlanan yardımlar</PrimaryButton>
                  <PrimaryButton variant="light" onClick={() => onToast('Yakında')}>Kurum onayları</PrimaryButton>
                </div>
              </div>
            </AdminPanel>
          </div>
        </>
      )}
    </main>
  )
}

function AdminPanel({ title, children }) {
  return (
    <section className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-xl font-black text-avuc-text">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}
