import { UrgentNeedsSection } from '@/components/layout/UrgentNeedsSection'

export default function UrgentNeedsPage({ onNavigate }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <UrgentNeedsSection onNavigate={onNavigate} />
      <div className="mt-8 rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
        <h3 className="text-xl font-black text-avuc-text">Boş durum ve güvenli bildirim</h3>
        <p className="mt-2 text-sm leading-6 text-avuc-muted">Belirli bir şehirde ihtiyaç bulunmadığında kullanıcılar tek tıkla acil yardım bildirebilir veya gönüllü ekip bekleme listesine katılabilir.</p>
      </div>
    </main>
  )
}
