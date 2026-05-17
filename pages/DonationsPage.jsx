import { useEffect, useState } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/layout/Badge'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { api } from '@/services/api'
import { classNames } from '@/utils/classNames'

export default function DonationsPage({ onToast, onLoginRequired }) {
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [trackingStep, setTrackingStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const steps = ['Bağış alındı', 'Paket hazırlanıyor', 'Araca yüklendi', 'Bölgeye ulaştı', 'Teslim edildi']

  useEffect(() => {
    api.get('/donations')
      .then(({ data }) => {
        const mapped = (data || []).map((pkg) => ({
          ...pkg,
          items: typeof pkg.items === 'string' ? pkg.items.split(', ') : (pkg.items || []),
        }))
        setPackages(mapped)
        if (mapped.length > 0) setSelectedPackage(mapped[0])
      })
      .catch(() => onToast('Bağış paketleri yüklenirken hata oluştu'))
      .finally(() => setLoading(false))
  }, [onToast])

  useEffect(() => {
    if (!selectedPackage) return undefined
    setTrackingStep(1)
    const timer = window.setInterval(() => {
      setTrackingStep((current) => (current >= steps.length ? steps.length : current + 1))
    }, 1600)
    return () => window.clearInterval(timer)
  }, [selectedPackage, steps.length])

  const handleDonate = async (item) => {
    try {
      await api.post('/donations', { packageName: item.name, amount: item.price, items: Array.isArray(item.items) ? item.items.join(', ') : item.items })
      setSelectedPackage(item)
      onToast(`${item.name} bağışı için takip akışı başlatıldı`)
    } catch (error) {
      if (error.response?.status === 401) {
        onLoginRequired()
      } else {
        onToast('Bağış yapılırken hata oluştu')
      }
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Bağış"
        title="Hazır yardım paketleriyle destek ol"
        description="Her paket içerik, tahmini fiyat ve kaç kişiye destek olduğu bilgisiyle şeffaf takip edilir."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-avuc-muted">Yükleniyor...</div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {packages.map((item) => (
                <article key={item.id} className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-black text-avuc-text">{item.name}</h3>
                    <Badge className="border-avuc-green/20 bg-avuc-lightGreen text-avuc-success">{item.price}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-avuc-muted">{item.supports}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.items.map((content) => <Badge key={content} className="border-avuc-line bg-slate-50 text-avuc-muted">{content}</Badge>)}
                  </div>
                  <PrimaryButton
                    onClick={() => handleDonate(item)}
                    className="mt-5 w-full"
                    variant={selectedPackage?.id === item.id ? 'green' : 'blue'}
                  >
                    Bağış yap
                  </PrimaryButton>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft lg:sticky lg:top-24">
              <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">Yardım takip sistemi</Badge>
              <h3 className="mt-4 text-xl font-black text-avuc-text">{selectedPackage?.name}</h3>
              <p className="mt-2 text-sm leading-6 text-avuc-muted">Bağış sonrası paket hareketleri örnek takip akışıyla gösterilir.</p>
              <div className="mt-6 grid gap-4">
                {steps.map((step, index) => {
                  const active = index + 1 <= trackingStep
                  return (
                    <div key={step} className="flex gap-3">
                      <div className={classNames('mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black', active ? 'bg-avuc-green text-white' : 'bg-slate-100 text-avuc-muted')}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={classNames('font-black', active ? 'text-avuc-text' : 'text-avuc-muted')}>{step}</p>
                        <p className="text-xs font-semibold text-avuc-muted">{active ? 'Tamamlandı veya işlemde' : 'Sıradaki adım'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </aside>
          </>
        )}
      </div>
    </main>
  )
}
