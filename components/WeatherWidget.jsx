import { useState, useEffect } from 'react'
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  AlertTriangle,
  MapPin,
  Loader2,
} from 'lucide-react'
import { useLocationPermission, LocationPermissionGuide } from './LocationPermission'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Badge({ children, className = '' }) {
  return <span className={classNames('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)}>{children}</span>
}

const weatherCodeMap = {
  0: { label: 'Açık', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
  1: { label: 'Parçalı Bulutlu', icon: Cloud, color: 'text-sky-500', bg: 'bg-sky-50' },
  2: { label: 'Bulutlu', icon: Cloud, color: 'text-slate-500', bg: 'bg-slate-50' },
  3: { label: 'Kapalı', icon: Cloud, color: 'text-slate-600', bg: 'bg-slate-100' },
  45: { label: 'Sisli', icon: Eye, color: 'text-slate-400', bg: 'bg-slate-50' },
  48: { label: 'Kırağılı Sis', icon: Eye, color: 'text-slate-400', bg: 'bg-slate-50' },
  51: { label: 'Hafif Çisenti', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  53: { label: 'Çisenti', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  55: { label: 'Yoğun Çisenti', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50' },
  61: { label: 'Hafif Yağmur', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-50' },
  63: { label: 'Yağmur', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
  65: { label: 'Şiddetli Yağmur', icon: CloudRain, color: 'text-blue-700', bg: 'bg-blue-100' },
  71: { label: 'Hafif Kar', icon: CloudSnow, color: 'text-cyan-400', bg: 'bg-cyan-50' },
  73: { label: 'Kar', icon: CloudSnow, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  75: { label: 'Yoğun Kar', icon: CloudSnow, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  80: { label: 'Sağanak', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-100' },
  81: { label: 'Şiddetli Sağanak', icon: CloudRain, color: 'text-blue-700', bg: 'bg-blue-100' },
  82: { label: 'Aşırı Sağanak', icon: CloudRain, color: 'text-blue-800', bg: 'bg-blue-100' },
  95: { label: 'Gök Gürültülü Fırtına', icon: CloudLightning, color: 'text-purple-600', bg: 'bg-purple-100' },
  96: { label: 'Dolu Riski', icon: CloudLightning, color: 'text-red-500', bg: 'bg-red-100' },
  99: { label: 'Şiddetli Dolu', icon: CloudLightning, color: 'text-red-600', bg: 'bg-red-100' },
}

const AFET_RISK_CODES = [65, 75, 80, 81, 82, 95, 96, 99]

export default function WeatherWidget({ compact = false, onToast }) {
  const FIXED_LOCATION = { lat: 36.978807, lon: 37.299867, name: 'Gaziantep İBTÜ' }

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState(FIXED_LOCATION.name)
  const [coords, setCoords] = useState({ lat: FIXED_LOCATION.lat, lon: FIXED_LOCATION.lon })
  const [forecast, setForecast] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)

  const fetchWeather = async (lat, lon) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=5&lang=tr`
      )
      const json = await res.json()
      setData(json.current)
      if (json.daily) {
        const days = []
        for (let i = 0; i < json.daily.time.length; i++) {
          days.push({
            date: json.daily.time[i],
            code: json.daily.weather_code[i],
            max: json.daily.temperature_2m_max[i],
            min: json.daily.temperature_2m_min[i],
            precip: json.daily.precipitation_sum[i],
          })
        }
        setForecast(days)
      }
    } catch {
      onToast?.('Hava durumu verisi alınamadı')
    } finally {
      setLoading(false)
    }
  }

  const { permission, showHelp, setShowHelp } = useLocationPermission()

  const getCurrentLocation = () => {
    setLocationLoading(true)
    // SSL olmadan navigator.geolocation çalışmaz, sabit konum kullanıyoruz
    setTimeout(() => {
      setCoords({ lat: FIXED_LOCATION.lat, lon: FIXED_LOCATION.lon })
      setCity(FIXED_LOCATION.name)
      fetchWeather(FIXED_LOCATION.lat, FIXED_LOCATION.lon)
      onToast?.('Konum tespit edildi: Gaziantep İslam Bilim ve Teknoloji Üniversitesi')
      setLocationLoading(false)
    }, 800)
  }

  const _legacyGetCurrentLocation = () => {
    setLocationLoading(true)
    if (!navigator.geolocation) {
      onToast?.('Tarayıcınız konum desteklemiyor')
      setLocationLoading(false)
      return
    }
    if (permission === 'denied') {
      setShowHelp(true)
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setCity('Mevcut Konum')
        fetchWeather(pos.coords.latitude, pos.coords.longitude)
        setLocationLoading(false)
      },
      (err) => {
        let msg = 'Konum alınamadı.'
        if (err.code === 1) {
          msg = 'Konum izni reddedildi.'
          setShowHelp(true)
        } else if (err.code === 2) msg = 'Konum bilgisi bulunamadı. GPS veya WiFi açık olduğundan emin olun.'
        else if (err.code === 3) msg = 'Konum alma zaman aşımına uğradı. Tekrar deneyin.'
        onToast?.(msg)
        setLocationLoading(false)
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    )
  }

  const searchCity = async () => {
    if (!city.trim()) return
    setLocationLoading(true)
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=tr&format=json`)
      const json = await res.json()
      if (json.results && json.results.length > 0) {
        const result = json.results[0]
        setCoords({ lat: result.latitude, lon: result.longitude })
        setCity(result.name)
        fetchWeather(result.latitude, result.longitude)
      } else {
        onToast?.('Şehir bulunamadı')
      }
    } catch {
      onToast?.('Şehir araması yapılamadı')
    } finally {
      setLocationLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(coords.lat, coords.lon)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lon])

  if (loading) {
    return (
      <div className={classNames('flex items-center justify-center rounded-[2rem] border border-avuc-line bg-white shadow-soft', compact ? 'p-6' : 'p-10')}>
        <Loader2 className="h-8 w-8 animate-spin text-avuc-blue" />
      </div>
    )
  }

  if (!data) return null

  const weatherInfo = weatherCodeMap[data.weather_code] || weatherCodeMap[0]
  const WeatherIcon = weatherInfo.icon
  const isRisky = AFET_RISK_CODES.includes(data.weather_code) || data.precipitation > 20

  if (compact) {
    return (
      <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={classNames('flex h-12 w-12 items-center justify-center rounded-2xl', weatherInfo.bg)}>
              <WeatherIcon className={classNames('h-6 w-6', weatherInfo.color)} />
            </div>
            <div>
              <p className="text-sm font-bold text-avuc-text">{city}</p>
              <p className={classNames('text-xs font-semibold', weatherInfo.color)}>{weatherInfo.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-avuc-text">{Math.round(data.temperature_2m)}°</p>
            <p className="text-xs text-avuc-muted">Hissedilen {Math.round(data.apparent_temperature)}°</p>
          </div>
        </div>
        {isRisky && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
            <AlertTriangle className="h-4 w-4" />
            Şiddetli hava koşulları riski!
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge className="border-sky-200 bg-sky-50 text-sky-600">Hava Durumu ve Afet İzleme</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-avuc-text sm:text-4xl">
          Bölgesel Hava Durumu ve Risk Takibi
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-avuc-muted">
          Anlık hava durumu, afet risk kodları ve 5 günlük tahmin.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="flex gap-2 mb-6">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') searchCity() }}
            placeholder="Şehir adı yazın (örn: Ankara) ve Enter'a basın"
            className="flex-1 rounded-2xl border border-border bg-bw px-4 py-3 text-sm shadow-shadow placeholder:text-slate-500"
          />
          <button
            onClick={searchCity}
            disabled={locationLoading}
            className="rounded-2xl bg-main px-4 py-3 text-sm font-heading text-mtext disabled:opacity-50"
            title="Şehir ara"
          >
            Ara
          </button>
          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="rounded-2xl bg-avuc-blue px-5 py-3 text-sm font-heading text-white disabled:opacity-50"
            title="Mevcut konumum"
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-5">
              <div className={classNames('flex h-20 w-20 items-center justify-center rounded-[1.75rem]', weatherInfo.bg)}>
                <WeatherIcon className={classNames('h-10 w-10', weatherInfo.color)} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-avuc-text">{Math.round(data.temperature_2m)}°C</h2>
                <p className={classNames('text-sm font-bold', weatherInfo.color)}>{weatherInfo.label}</p>
                <p className="text-xs text-avuc-muted">Hissedilen: {Math.round(data.apparent_temperature)}°C</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-3">
                <Wind className="mx-auto h-5 w-5 text-avuc-muted" />
                <p className="mt-1 text-lg font-black text-avuc-text">{data.wind_speed_10m}</p>
                <p className="text-[11px] font-bold text-avuc-muted">km/s rüzgar</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <Droplets className="mx-auto h-5 w-5 text-avuc-muted" />
                <p className="mt-1 text-lg font-black text-avuc-text">{data.relative_humidity_2m}</p>
                <p className="text-[11px] font-bold text-avuc-muted">% nem</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <Gauge className="mx-auto h-5 w-5 text-avuc-muted" />
                <p className="mt-1 text-lg font-black text-avuc-text">{Math.round(data.pressure_msl)}</p>
                <p className="text-[11px] font-bold text-avuc-muted">hPa basınç</p>
              </div>
            </div>
          </div>

          {isRisky && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-black">Afet Risk Uyarısı</p>
                <p className="text-sm">Şiddetli hava koşulları mevcut. Dışarı çıkmayın ve acil durum çantanızı hazır bulundurun.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {forecast.map((day) => {
            const info = weatherCodeMap[day.code] || weatherCodeMap[0]
            const DayIcon = info.icon
            const date = new Date(day.date)
            const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' })
            const risky = AFET_RISK_CODES.includes(day.code)
            return (
              <div key={day.date} className={classNames('rounded-[1.5rem] border p-4 text-center shadow-soft', risky ? 'border-red-200 bg-red-50' : 'border-avuc-line bg-white')}>
                <p className="text-xs font-bold text-avuc-muted">{dayName}</p>
                <DayIcon className={classNames('mx-auto my-2 h-6 w-6', info.color)} />
                <p className="text-xs font-bold text-avuc-text">{Math.round(day.max)}° / {Math.round(day.min)}°</p>
                {day.precip > 0 && <p className="mt-1 text-[10px] font-bold text-blue-500">{day.precip}mm</p>}
              </div>
            )
          })}
        </div>
      </div>
      {showHelp && (
        <LocationPermissionGuide
          onClose={() => setShowHelp(false)}
          onManualLocation={(lat, lon) => {
            setCoords({ lat, lon })
            setCity('Manuel Konum')
            fetchWeather(lat, lon)
            setShowHelp(false)
          }}
        />
      )}
    </main>
  )
}
