import { startTransition, useEffect, useState, lazy, Suspense } from 'react'
import { Component as InfiniteGridBackground } from '@/components/ui/the-infinite-grid'
import { useAuth } from '@/context/AuthContext'
import LoginModal from './components/LoginModal'
import EmergencyHub from './components/EmergencyHub'
import WeatherWidget from './components/WeatherWidget'
import DisasterPrep from './components/DisasterPrep'
import EmergencyRadio from './components/EmergencyRadio'

import { Header } from '@/components/layout/Header'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { FloatingEmergencyButton } from '@/components/layout/FloatingEmergencyButton'
import { LoadingBar } from '@/components/layout/LoadingBar'
import { Toast } from '@/components/layout/Toast'
import { EmergencyModal } from '@/components/layout/EmergencyModal'
import { ScreenShake } from '@/components/effects/ScreenShake'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { flushQueue, getQueueLength } from '@/services/syncQueue'
import { api } from '@/services/api'

import HomePage from '@/pages/HomePage'
import ShelterPage from '@/pages/ShelterPage'
import HostPage from '@/pages/HostPage'
import MatchingPage from '@/pages/MatchingPage'
import DonationsPage from '@/pages/DonationsPage'
import UrgentNeedsPage from '@/pages/UrgentNeedsPage'
import VolunteerPage from '@/pages/VolunteerPage'
import CreateListingPage from '@/pages/CreateListingPage'
import ProfilePage from '@/pages/ProfilePage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import ReportsPage from '@/pages/ReportsPage'

const MapPage = lazy(() => import('@/pages/MapPage'))
const GatheringPoints = lazy(() => import('./components/GatheringPoints'))
const AdminPage = lazy(() => import('@/pages/AdminPage'))

import { pageTitles } from '@/utils/constants'

function LazyFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-avuc-blue border-t-transparent" />
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [isSwitching, setIsSwitching] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [loginOpen, setLoginOpen] = useState(false)
  const [shake, setShake] = useState(false)
  const online = useOnlineStatus()
  const { user, isLoggedIn, isAdmin, logout } = useAuth()

  useEffect(() => {
    document.title = `avuc | ${pageTitles[activePage] || 'Afet Yardım Koordinasyonu'}`
  }, [activePage])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  // useServiceWorker() // Service worker geçici devre dışı (cache sorunları için)

  useEffect(() => {
    if (online && getQueueLength() > 0) {
      flushQueue(api, ({ success, item }) => {
        if (success) {
          showToast(`İlan senkronize edildi: ${item.data?.title || 'Kayıt'}`)
        }
      })
    }
  }, [online])

  const showToast = (message) => setToast(message)

  const navigate = (page) => {
    if ((page === 'admin' || page === 'create') && !isLoggedIn) {
      setLoginOpen(true)
      return
    }
    setIsSwitching(true)
    startTransition(() => {
      setActivePage(page)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.setTimeout(() => setIsSwitching(false), 350)
  }

  const page = {
    home: <HomePage onNavigate={navigate} />,
    shelter: <ShelterPage onNavigate={navigate} onToast={showToast} />,
    host: <HostPage onToast={showToast} onLoginRequired={() => setLoginOpen(true)} />,
    match: <MatchingPage onToast={showToast} />,
    donations: <DonationsPage onToast={showToast} onLoginRequired={() => setLoginOpen(true)} />,
    map: <Suspense fallback={<LazyFallback />}><MapPage onNavigate={navigate} /></Suspense>,
    urgent: <UrgentNeedsPage onNavigate={navigate} />,
    volunteer: <VolunteerPage onToast={showToast} onLoginRequired={() => setLoginOpen(true)} />,
    create: <CreateListingPage onToast={showToast} onLoginRequired={() => setLoginOpen(true)} />,
    profile: <ProfilePage onNavigate={navigate} />,
    reports: <ReportsPage />,
    admin: <Suspense fallback={<LazyFallback />}>{isAdmin ? <AdminPage onToast={showToast} /> : <UnauthorizedPage onNavigate={navigate} />}</Suspense>,
    emergency: <EmergencyHub onToast={showToast} onLoginRequired={() => setLoginOpen(true)} />,
    weather: <WeatherWidget onToast={showToast} />,
    prep: <DisasterPrep />,
    radio: <EmergencyRadio onToast={showToast} />,
    gathering: <Suspense fallback={<LazyFallback />}><GatheringPoints onToast={showToast} /></Suspense>,
  }[activePage]

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-[calc(5rem+env(safe-area-inset-bottom))] text-avuc-text lg:pb-0">
      <div className="fixed inset-0 z-0">
        <InfiniteGridBackground />
      </div>
      <div className="relative z-10">
        <LoadingBar active={isSwitching} />
        {!online && (
          <div className="sticky top-0 z-[60] bg-amber-500 px-4 py-2 text-center text-xs font-bold text-white">
            Çevrimdışı mod: Veriler yerel olarak saklanıyor. Bağlantı sağlandığında senkronize edilecek.
          </div>
        )}
        <Header activePage={activePage} onNavigate={navigate} onLogin={() => setLoginOpen(true)} user={user} isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={logout} />
        <div className="animate-slide-up pt-20 sm:pt-24" key={activePage}>{page}</div>
        <FloatingEmergencyButton onClick={() => { setShake(true); setEmergencyOpen(true); setTimeout(() => setShake(false), 700); }} />
        <MobileBottomNav activePage={activePage} onNavigate={navigate} />
        <EmergencyModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} onSubmit={showToast} onLoginRequired={() => setLoginOpen(true)} />
        <Toast message={toast} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        <ScreenShake trigger={shake} />
      </div>
    </div>
  )
}

export default App
