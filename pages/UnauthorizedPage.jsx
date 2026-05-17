import { EmptyState } from '@/components/layout/EmptyState'
import { PrimaryButton } from '@/components/layout/PrimaryButton'

export default function UnauthorizedPage({ onNavigate }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
      <EmptyState
        title="Yetkisiz erişim"
        description="Bu sayfayı görüntülemek için admin yetkisi gerekiyor."
        action={<PrimaryButton onClick={() => onNavigate('home')}>Ana Sayfaya Dön</PrimaryButton>}
      />
    </main>
  )
}
