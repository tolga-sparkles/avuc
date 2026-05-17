import { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Crosshair } from 'lucide-react'
import { classNames } from '@/utils/classNames'

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

function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng])
    },
  })
  return position ? <Marker position={position} /> : null
}

export default function MapPicker({ value, onChange, label = 'Konum seçin', height = 'h-72' }) {
  const [position, setPosition] = useState(value ? [value.lat, value.lng] : null)
  const defaultCenter = [39.9208, 32.8541] // Ankara

  const handlePositionChange = useCallback((newPos) => {
    setPosition(newPos)
    onChange?.({ lat: newPos[0], lng: newPos[1] })
  }, [onChange])

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        handlePositionChange([lat, lng])
      },
      () => {},
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  return (
    <div className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-avuc-text">{label}</span>
        <button
          type="button"
          onClick={useCurrentLocation}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-avuc-muted transition hover:bg-slate-200"
        >
          <Crosshair className="h-3.5 w-3.5" />
          Mevcut konum
        </button>
      </div>
      <div className={classNames('relative overflow-hidden rounded-2xl border border-border shadow-shadow', height)}>
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 14 : 6}
          scrollWheelZoom={false}
          touchZoom={true}
          tap={false}
          dragging={false}
          className="h-full w-full touch-pan-y"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onPositionChange={handlePositionChange} />
        </MapContainer>
        {!position && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/5">
            <div className="rounded-2xl bg-white/90 px-5 py-3 text-center shadow-lg backdrop-blur">
              <MapPin className="mx-auto h-6 w-6 text-avuc-blue" />
              <p className="mt-1 text-xs font-bold text-avuc-muted">Haritaya tıklayarak konum seçin</p>
            </div>
          </div>
        )}
      </div>
      {position && (
        <p className="mt-2 text-xs text-avuc-muted">
          Seçilen: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      )}
    </div>
  )
}
