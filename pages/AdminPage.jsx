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

export default function AdminPage({ onToast }) {
  const [stats, setStats] = useState({})
  const [pending, setPending] = useState([])
  const [reports, setReports] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: {} })),
      api.get('/admin/pending-listings').catch(() => ({ data: [] })),
      api.get('/admin/reports').catch(() => ({ data: [] })),
      api.get('/donations').catch(() => ({ data: [] })),
    ])
      .then(([statsRes, pendingRes, reportsRes, donationsRes]) => {
        setStats(statsRes.data || {})
        setPending(pendingRes.data || [])
        setReports(reportsRes.data || [])
        setDonations(donationsRes.data || [])
      })
      .catch(() => onToast('Admin verileri yüklenirken hata oluştu'))
      .finally(() => setLoading(false))
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

  const pendingCount = stats.pendingListings ?? pending.length
  const reportCount = stats.reports ?? reports.length
  const zoneCount = stats.activeZones ?? disasterZones.length
  const donationCount = stats.trackingDonations ?? donations.length

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
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Bekleyen ilan', pendingCount],
              ['Sahte ilan raporu', reportCount],
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

            <AdminPanel title="Acil ihtiyaç ve afet bölgesi ekle">
              <form className="grid gap-3" onSubmit={(event) => {
                event.preventDefault()
                onToast('Yeni acil ihtiyaç taslağı oluşturuldu')
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
                  <PrimaryButton variant="light">Kullanıcı doğrulamaları</PrimaryButton>
                  <PrimaryButton variant="light">Gönüllü görevi oluştur</PrimaryButton>
                  <PrimaryButton variant="light">Tamamlanan yardımlar</PrimaryButton>
                  <PrimaryButton variant="light">Kurum onayları</PrimaryButton>
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
