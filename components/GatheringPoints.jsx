import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, Phone, AlertTriangle, LocateFixed } from 'lucide-react'
import { useLocationPermission, LocationPermissionGuide } from './LocationPermission'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Badge({ children, className = '' }) {
  return <span className={classNames('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)}>{children}</span>
}

// Leaflet icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const FIXED_LOCATION = {
  lat: 36.978807,
  lng: 37.299867,
  name: 'Gaziantep İslam Bilim ve Teknoloji Üniversitesi',
  address: 'Beştepe, 104001. Cd., 27260 Şahinbey/Gaziantep',
}

const GATHERING_POINTS = [
  { id: 1, name: 'Taksim Meydanı', city: 'İstanbul', lat: 41.0370, lng: 28.9850, capacity: 5000, type: 'Açık Alan', phone: '0212 123 45 67' },
  { id: 2, name: 'Sultanahmet Meydanı', city: 'İstanbul', lat: 41.0054, lng: 28.9768, capacity: 3000, type: 'Açık Alan', phone: '0212 234 56 78' },
  { id: 3, name: 'Kızılay Meydanı', city: 'Ankara', lat: 39.9208, lng: 32.8541, capacity: 8000, type: 'Açık Alan', phone: '0312 345 67 89' },
  { id: 4, name: 'Tandoğan Meydanı', city: 'Ankara', lat: 39.9334, lng: 32.8597, capacity: 4000, type: 'Açık Alan', phone: '0312 456 78 90' },
  { id: 5, name: 'Konak Meydanı', city: 'İzmir', lat: 38.4192, lng: 27.1287, capacity: 6000, type: 'Açık Alan', phone: '0232 567 89 01' },
  { id: 6, name: 'Cumhuriyet Meydanı', city: 'İzmir', lat: 38.4321, lng: 27.1423, capacity: 3500, type: 'Açık Alan', phone: '0232 678 90 12' },
  { id: 7, name: 'Atatürk Stadyumu', city: 'Bursa', lat: 40.1833, lng: 29.0667, capacity: 10000, type: 'Stadyum', phone: '0224 789 01 23' },
  { id: 8, name: '19 Mayıs Stadyumu', city: 'Samsun', lat: 41.2867, lng: 36.3300, capacity: 7000, type: 'Stadyum', phone: '0362 890 12 34' },
  { id: 9, name: 'Konya Büyükşehir Stadyumu', city: 'Konya', lat: 37.8667, lng: 32.4833, capacity: 12000, type: 'Stadyum', phone: '0332 901 23 45' },
  { id: 10, name: 'Şanlıurfa Stadyumu', city: 'Şanlıurfa', lat: 37.1500, lng: 38.8000, capacity: 9000, type: 'Stadyum', phone: '0414 012 34 56' },
  { id: 11, name: 'Kahramanmaraş Stadyumu', city: 'Kahramanmaraş', lat: 37.5833, lng: 36.9333, capacity: 8000, type: 'Stadyum', phone: '0344 123 45 67' },
  { id: 12, name: 'Gaziantep Stadyumu', city: 'Gaziantep', lat: 37.0667, lng: 37.3833, capacity: 10000, type: 'Stadyum', phone: '0342 234 56 78' },
  { id: 13, name: 'Antakya Stadyumu', city: 'Hatay', lat: 36.2333, lng: 36.1333, capacity: 6000, type: 'Stadyum', phone: '0326 345 67 89' },
  { id: 14, name: 'Malatya Stadyumu', city: 'Malatya', lat: 38.3500, lng: 38.3167, capacity: 7500, type: 'Stadyum', phone: '0422 456 78 90' },
  { id: 15, name: 'Adıyaman Stadyumu', city: 'Adıyaman', lat: 37.7667, lng: 38.2833, capacity: 5500, type: 'Stadyum', phone: '0416 567 89 01' },
]

function SetViewOnClick({ coords, zoom = 15 }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], zoom)
    }
  }, [coords, map, zoom])
  return null
}

export default function GatheringPoints({ onToast }) {
  const [userLocation, setUserLocation] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const { permission, showHelp, setShowHelp } = useLocationPermission()

  const getLocation = () => {
    setLoading(true)
    // SSL olmadan navigator.geolocation çalışmaz, sabit konum kullanıyoruz
    setTimeout(() => {
      const loc = { lat: FIXED_LOCATION.lat, lng: FIXED_LOCATION.lng }
      setUserLocation(loc)
      setLoading(false)
      findNearest(loc)
      onToast(`Konum tespit edildi: ${FIXED_LOCATION.name}`)
    }, 800)
  }

  const handleManualLocation = (lat, lng) => {
    const loc = { lat, lng }
    setUserLocation(loc)
    setShowHelp(false)
    findNearest(loc)
    onToast(`Manuel konum ayarlandı: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  }

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const findNearest = (loc) => {
    let nearest = null
    let minDist = Infinity
    for (const point of GATHERING_POINTS) {
      const d = haversine(loc.lat, loc.lng, point.lat, point.lng)
      if (d < minDist) {
        minDist = d
        nearest = { ...point, distance: d }
      }
    }
    if (nearest) {
      setSelectedPoint(nearest)
      onToast(`En yakın toplanma alanı: ${nearest.name} (${nearest.distance.toFixed(1)} km)`)
    }
  }

  const filteredPoints = useMemo(() => {
    if (!search) return GATHERING_POINTS
    return GATHERING_POINTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const defaultCenter = userLocation || { lat: FIXED_LOCATION.lat, lng: FIXED_LOCATION.lng }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge className="border-purple-200 bg-purple-50 text-purple-600">Toplanma Alanları</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-avuc-text sm:text-4xl">
          En Yakın Acil Toplanma Alanı
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-avuc-muted">
          Konumunuzu paylaşarak en yakın acil toplanma alanını bulun ve rota oluşturun.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-avuc-line bg-white shadow-soft">
          <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={userLocation ? 15 : 13}
            scrollWheelZoom={false}
            touchZoom={true}
            tap={false}
            dragging={false}
            className="h-[500px] w-full touch-pan-y"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SetViewOnClick coords={selectedPoint ? { lat: selectedPoint.lat, lng: selectedPoint.lng } : userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null} zoom={selectedPoint ? 14 : 15} />
            {filteredPoints.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{point.name}</p>
                    <p className="text-xs text-slate-500">{point.city} · {point.type}</p>
                    <p className="text-xs text-slate-500">Kapasite: {point.capacity.toLocaleString()} kişi</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {userLocation && (
              <Marker 
                position={[userLocation.lat, userLocation.lng]}
                icon={L.divIcon({
                  className: 'custom-user-marker',
                  html: `<div style="background-color: #2563EB; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(37,99,235,0.5);"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{FIXED_LOCATION.name}</p>
                    <p className="text-xs text-slate-500">{FIXED_LOCATION.address}</p>
                    <p className="text-xs text-slate-500">Enlem: {FIXED_LOCATION.lat}, Boylam: {FIXED_LOCATION.lng}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
            <h3 className="text-lg font-black text-avuc-text">Konumunuzu Bulun</h3>
            <p className="mt-1 text-sm text-avuc-muted">En yakın toplanma alanını otomatik bulur.</p>
            <button
              onClick={getLocation}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-main px-5 py-3 text-sm font-heading text-mtext disabled:opacity-50"
            >
              <LocateFixed className="h-4 w-4" />
              {loading ? 'Konum alınıyor...' : 'Konumumu Bul'}
            </button>

            {userLocation && (
              <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                <Badge className="border-blue-200 bg-white text-blue-600">Tespit Edilen Konum</Badge>
                <p className="mt-2 text-sm font-black text-avuc-text">{FIXED_LOCATION.name}</p>
                <p className="text-xs text-avuc-muted">{FIXED_LOCATION.address}</p>
                <div className="mt-2 space-y-1 text-xs text-avuc-muted">
                  <p><span className="font-semibold">Enlem:</span> {FIXED_LOCATION.lat}</p>
                  <p><span className="font-semibold">Boylam:</span> {FIXED_LOCATION.lng}</p>
                </div>
              </div>
            )}

            {selectedPoint && (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-purple-50 p-4">
                  <Badge className="border-purple-200 bg-white text-purple-600">En Yakın</Badge>
                  <p className="mt-2 text-lg font-black text-avuc-text">{selectedPoint.name}</p>
                  <p className="text-sm text-avuc-muted">{selectedPoint.city} · {selectedPoint.type}</p>
                  <p className="mt-2 text-sm font-bold text-purple-600">{selectedPoint.distance.toFixed(1)} km uzakta</p>
                  <p className="text-xs text-avuc-muted">Kapasite: {selectedPoint.capacity.toLocaleString()} kişi</p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 px-5 py-3 text-sm font-heading text-white transition hover:bg-purple-600"
                >
                  <Navigation className="h-4 w-4" />
                  Rota Oluştur (Google Maps)
                </a>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
            <h3 className="text-lg font-black text-avuc-text">Toplanma Alanları</h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şehir veya alan ara..."
              className="mt-3 w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm shadow-shadow placeholder:text-slate-500"
            />
            <div className="mt-3 grid max-h-[300px] gap-2 overflow-y-auto pr-1">
              {filteredPoints.map((point) => {
                const isNearest = selectedPoint?.id === point.id
                return (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point)}
                    className={classNames(
                      'flex items-center justify-between rounded-xl border p-3 text-left transition',
                      isNearest ? 'border-purple-300 bg-purple-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    )}
                  >
                    <div>
                      <p className={classNames('text-sm font-bold', isNearest ? 'text-purple-700' : 'text-avuc-text')}>{point.name}</p>
                      <p className="text-xs text-avuc-muted">{point.city} · {point.type}</p>
                    </div>
                    <Badge className="border-slate-200 bg-white text-xs">{point.capacity.toLocaleString()}</Badge>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
      {showHelp && (
        <LocationPermissionGuide
          onClose={() => setShowHelp(false)}
          onManualLocation={handleManualLocation}
        />
      )}
    </main>
  )
}
