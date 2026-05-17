import { useState, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Info, X, Settings, KeyRound } from 'lucide-react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function useLocationPermission() {
  const [permission, setPermission] = useState('unknown') // 'prompt' | 'granted' | 'denied' | 'unknown'
  const [showHelp, setShowHelp] = useState(false)

  const checkPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermission('unknown')
      return
    }
    if ('permissions' in navigator && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' })
        setPermission(result.state) // 'granted' | 'denied' | 'prompt'
        if (result.onchange !== undefined) {
          result.onchange = () => setPermission(result.state)
        }
      } catch {
        setPermission('unknown')
      }
    } else {
      setPermission('unknown')
    }
  }, [])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return { permission, showHelp, setShowHelp, checkPermission }
}

export function LocationPermissionGuide({ onClose, onManualLocation }) {
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [tab, setTab] = useState('browser') // 'browser' | 'manual'

  const handleManual = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    if (!isNaN(lat) && !isNaN(lng)) {
      onManualLocation(lat, lng)
    }
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-end bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-lg animate-slide-up rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100">
              <MapPin className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-black text-avuc-text">Konum İzni Gerekli</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X className="h-5 w-5 text-avuc-muted" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setTab('browser')}
            className={classNames(
              'flex-1 rounded-2xl px-4 py-2 text-sm font-heading transition',
              tab === 'browser' ? 'bg-main text-mtext' : 'bg-bw text-text'
            )}
          >
            Tarayıcı İzni
          </button>
          <button
            onClick={() => setTab('manual')}
            className={classNames(
              'flex-1 rounded-2xl px-4 py-2 text-sm font-heading transition',
              tab === 'manual' ? 'bg-main text-mtext' : 'bg-bw text-text'
            )}
          >
            Manuel Giriş
          </button>
        </div>

        {tab === 'browser' ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-bold">Neden konum izni istiyoruz?</p>
              <p className="mt-1">Acil durumda en yakın toplanma alanını, yardım noktalarını ve hava durumunu doğru şekilde gösterebilmemiz için konum bilginize ihtiyaç duyuyoruz. Konum veriniz sadece cihazınızda kalır.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-avuc-text">Adım adım izin verme:</h3>
              <ol className="space-y-3 text-sm text-avuc-muted">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-avuc-blue text-xs font-black text-white">1</span>
                  <span>
                    <strong className="text-avuc-text">Chrome / Edge:</strong> Adres çubuğunun solundaki <Info className="inline h-4 w-4" /> kilit veya <Settings className="inline h-4 w-4" /> ayar simgesine tıklayın.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-avuc-blue text-xs font-black text-white">2</span>
                  <span>
                    <strong className="text-avuc-text">Konum</strong> seçeneğini bulun ve <strong className="text-green-600">"İzin Ver"</strong> olarak değiştirin.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-avuc-blue text-xs font-black text-white">3</span>
                  <span>
                    Sayfayı yenileyin ve <strong className="text-avuc-text">"Konumumu Al"</strong> butonuna tekrar tıklayın.
                  </span>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-xs text-avuc-muted">
              <p className="font-bold text-avuc-text">Mobil Cihazlar:</p>
              <p className="mt-1">Ayarlar {'>'} Konum {'>'} Tarayıcı için konumu açın. Ayrıca GPS/WiFi açık olduğundan emin olun.</p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl bg-main px-5 py-3 text-sm font-heading text-mtext"
            >
              Sayfayı Yenile ve Tekrar Dene
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-avuc-muted">
              Konum izni veremiyorsanız manuel olarak koordinat veya şehir adı girebilirsiniz.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-avuc-text">Enlem (Lat)</span>
                <input
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="41.0082"
                  className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm shadow-shadow placeholder:text-slate-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-avuc-text">Boylam (Lng)</span>
                <input
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="28.9784"
                  className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm shadow-shadow placeholder:text-slate-500"
                />
              </label>
            </div>
            <button
              onClick={handleManual}
              className="w-full rounded-2xl bg-main px-5 py-3 text-sm font-heading text-mtext disabled:opacity-50"
              disabled={!manualLat || !manualLng}
            >
              <Navigation className="mr-2 inline h-4 w-4" />
              Konumu Kullan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
