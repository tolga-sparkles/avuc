import { useState, useEffect } from 'react'
import { Activity, MapPin, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { classNames } from '@/utils/classNames'

function Badge({ children, className = '' }) {
  return <span className={classNames('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)}>{children}</span>
}

function getMagColor(mag) {
  if (mag >= 6) return 'bg-red-600 text-white border-red-700'
  if (mag >= 5) return 'bg-red-500 text-white border-red-600'
  if (mag >= 4) return 'bg-orange-500 text-white border-orange-600'
  if (mag >= 3) return 'bg-amber-500 text-white border-amber-600'
  return 'bg-slate-400 text-white border-slate-500'
}

function getMagLabel(mag) {
  if (mag >= 6) return 'Büyük Deprem'
  if (mag >= 5) return 'Kuvvetli Deprem'
  if (mag >= 4) return 'Orta Şiddetli'
  if (mag >= 3) return 'Hafif Deprem'
  return 'Çok Hafif'
}

function formatTime(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMins < 1) return 'Az önce'
  if (diffMins < 60) return `${diffMins} dk önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function getLocationName(place) {
  if (!place) return 'Bilinmiyor'
  // USGS place formatı genelde "10 km NE of City, Country"
  // Türkiye'ye özel sadeleştirme
  return place
    .replace(/, Turkey$/, '')
    .replace(/Türkiye$/, '')
    .replace(/^.*km [NS][EW]? of /, '')
    .trim()
}

export default function EarthquakeFeed({ compact = false, onToast }) {
  const [quakes, setQuakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchQuakes = async () => {
      setLoading(true)
      try {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)

        const url = new URL('https://earthquake.usgs.gov/fdsnws/event/1/query')
        url.searchParams.set('format', 'geojson')
        url.searchParams.set('starttime', start.toISOString().slice(0, 10))
        url.searchParams.set('endtime', end.toISOString().slice(0, 10))
        url.searchParams.set('minlatitude', '35')
        url.searchParams.set('maxlatitude', '43')
        url.searchParams.set('minlongitude', '25')
        url.searchParams.set('maxlongitude', '46')
        url.searchParams.set('minmagnitude', '3')
        url.searchParams.set('orderby', 'time')

        const res = await fetch(url.toString())
        const json = await res.json()

        const features = (json.features || []).map((f) => ({
          id: f.id,
          mag: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          url: f.properties.url,
          depth: f.geometry.coordinates[2],
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        }))

        setQuakes(features)
      } catch {
        setError(true)
        onToast?.('Deprem verisi alınamadı')
      } finally {
        setLoading(false)
      }
    }

    fetchQuakes()
    const interval = setInterval(fetchQuakes, 300000) // Her 5 dakika yenile
    return () => clearInterval(interval)
  }, [onToast])

  const recent = quakes.slice(0, compact ? 3 : 5)
  const rest = quakes.slice(5)

  if (loading) {
    return (
      <div className={classNames('flex items-center justify-center rounded-[2rem] border border-avuc-line bg-white shadow-soft', compact ? 'p-6' : 'p-10')}>
        <Activity className="h-8 w-8 animate-spin text-avuc-red" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={classNames('rounded-[2rem] border border-avuc-line bg-white shadow-soft', compact ? 'p-6' : 'p-8')}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm font-bold text-avuc-text">Deprem verisi şu an alınamıyor.</p>
        </div>
      </div>
    )
  }

  if (!recent.length) {
    return (
      <div className={classNames('rounded-[2rem] border border-avuc-line bg-white shadow-soft', compact ? 'p-6' : 'p-8')}>
        <p className="text-sm text-avuc-muted">Son 7 günde magnitüd 3.0+ deprem kaydı bulunamadı.</p>
      </div>
    )
  }

  const latestMag = recent[0]?.mag || 0
  const isMajor = latestMag >= 5

  return (
    <div className={classNames('rounded-[2rem] border shadow-soft', isMajor ? 'border-red-200 bg-red-50' : 'border-avuc-line bg-white', compact ? 'p-5' : 'p-6')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={classNames('flex h-12 w-12 items-center justify-center rounded-2xl', isMajor ? 'bg-red-100' : 'bg-avuc-lightRed')}>
            <Activity className={classNames('h-6 w-6', isMajor ? 'text-red-600' : 'text-avuc-red')} />
          </div>
          <div>
            <h3 className="text-lg font-black text-avuc-text">Son Depremler</h3>
            <p className="text-xs text-avuc-muted">USGS verisi • Son 7 gün • Türkiye ve çevresi</p>
          </div>
        </div>
        {isMajor && <Badge className="border-red-200 bg-red-100 text-red-600 animate-pulse">KRİTİK</Badge>}
      </div>

      {isMajor && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Son deprem {latestMag.toFixed(1)} magnitüdünde! Lütfen güvenli bölgede olun.
        </div>
      )}

      <div className="mt-4 space-y-2">
        {recent.map((q) => (
          <div key={q.id} className={classNames('flex items-center justify-between rounded-2xl border p-3 transition', isMajor && q.mag >= 5 ? 'border-red-200 bg-white' : 'border-slate-100 bg-slate-50')}>
            <div className="flex items-center gap-3">
              <div className={classNames('flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black', getMagColor(q.mag))}>
                {q.mag.toFixed(1)}
              </div>
              <div>
                <p className="text-sm font-bold text-avuc-text">{getLocationName(q.place)}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-avuc-muted">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{q.depth.toFixed(1)} km derinlik</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(q.time)}</span>
                </div>
              </div>
            </div>
            <Badge className={getMagColor(q.mag)}>{getMagLabel(q.mag)}</Badge>
          </div>
        ))}
      </div>

      {!compact && rest.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl py-2 text-xs font-bold text-avuc-muted transition hover:bg-slate-50"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {expanded ? 'Daha az göster' : `${rest.length} deprem daha göster`}
          </button>
          {expanded && (
            <div className="mt-2 space-y-2">
              {rest.map((q) => (
                <div key={q.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className={classNames('flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black', getMagColor(q.mag))}>
                      {q.mag.toFixed(1)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-avuc-text">{getLocationName(q.place)}</p>
                      <p className="text-[11px] text-avuc-muted">{formatTime(q.time)} · {q.depth.toFixed(1)} km</p>
                    </div>
                  </div>
                  <Badge className={getMagColor(q.mag)}>{getMagLabel(q.mag)}</Badge>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
