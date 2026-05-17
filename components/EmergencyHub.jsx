import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Phone,
  Volume2,
  VolumeX,
  MapPin,
  Share2,
  MessageCircle,
  AlertTriangle,
  Flashlight,
  Radio,
  Waves,
  Wind,
  Flame,
  Activity,
  Send,
  Siren,
} from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { useLocationPermission, LocationPermissionGuide } from './LocationPermission'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Badge({ children, className = '' }) {
  return <span className={classNames('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)}>{children}</span>
}

// MORS KODU HARİTASI
const MORSE_CODE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/'
}

const EMERGENCY_NUMBERS = [
  { name: 'Acil Çağrı Merkezi', number: '112', desc: 'Ambulans, itfaiye, jandarma', icon: Activity, color: 'bg-red-500', urgent: true },
  { name: 'Polis İmdat', number: '155', desc: 'Asayiş ve güvenlik', icon: Siren, color: 'bg-blue-600', urgent: true },
  { name: 'Jandarma', number: '156', desc: 'Kırsal alan güvenliği', icon: Siren, color: 'bg-emerald-600', urgent: true },
  { name: 'AFAD', number: '122', desc: 'Afet ve Acil Durum Yönetimi', icon: AlertTriangle, color: 'bg-orange-500', urgent: true },
  { name: 'Orman Yangını', number: '177', desc: 'Orman yangın ihbar', icon: Flame, color: 'bg-red-600' },
  { name: 'Elektrik Arıza', number: '186', desc: 'TEİAŞ / BEDAŞ arıza', icon: Flashlight, color: 'bg-yellow-500' },
  { name: 'Doğal Gaz', number: '187', desc: 'Gaz kaçağı ihbar', icon: Flame, color: 'bg-sky-500' },
  { name: 'Su Arıza', number: '185', desc: 'İSKİ / su arıza', icon: Waves, color: 'bg-cyan-500' },
  { name: 'Kızılay', number: '168', desc: 'Kan ve acil yardım hattı', icon: Activity, color: 'bg-red-500' },
  { name: 'UMKE', number: '113', desc: 'Ulusal Medikal Kurtarma', icon: Activity, color: 'bg-green-600' },
  { name: 'Sahil Güvenlik', number: '158', desc: 'Deniz arama kurtarma', icon: Waves, color: 'bg-blue-500' },
  { name: 'Çevre Şikayet', number: '181', desc: 'Çevre kirliliği ihbar', icon: Wind, color: 'bg-teal-500' },
]

function SosAlarm() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState('intermittent') // 'continuous' | 'intermittent'
  const audioCtxRef = useRef(null)
  const intervalRef = useRef(null)

  const playTone = useCallback((freq, duration, type = 'sawtooth') => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration - 0.05)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }, [])

  const startAlarm = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    setIsPlaying(true)

    if (mode === 'continuous') {
      // Sürekli wail siren: 400Hz -> 1200Hz -> 400Hz süpürme
      let rising = true
      let freq = 400
      intervalRef.current = setInterval(() => {
        freq += rising ? 40 : -40
        if (freq >= 1200) rising = false
        if (freq <= 400) rising = true
        playTone(freq, 0.15, 'sawtooth')
      }, 150)
    } else {
      // Kesikli: 3 kısa bip + 1 uzun bip (SOS tarzı)
      let step = 0
      intervalRef.current = setInterval(() => {
        step = step % 5
        if (step < 3) {
          playTone(880, 0.15, 'square') // kısa
        } else if (step === 3) {
          playTone(600, 0.5, 'square') // uzun
        }
        step++
      }, 650)
    }
  }, [mode, playTone])

  const stopAlarm = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => stopAlarm()
  }, [stopAlarm])

  useEffect(() => {
    if (isPlaying) {
      stopAlarm()
      const t = setTimeout(() => startAlarm(), 100)
      return () => clearTimeout(t)
    }
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className={classNames('flex h-14 w-14 items-center justify-center rounded-2xl', isPlaying ? 'bg-avuc-red animate-pulse' : 'bg-slate-100')}>
          {isPlaying ? <Volume2 className="h-7 w-7 text-white" /> : <VolumeX className="h-7 w-7 text-avuc-muted" />}
        </div>
        <div>
          <h3 className="text-lg font-black text-avuc-text">Acil Durum Sireni</h3>
          <p className="text-sm text-avuc-muted">Çevrenizdekilere sesli sinyal verin</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('continuous')}
          className={classNames(
            'rounded-2xl border px-3 py-2 text-xs font-bold transition',
            mode === 'continuous'
              ? 'border-avuc-red bg-avuc-lightRed text-avuc-red'
              : 'border-avuc-line bg-slate-50 text-avuc-muted hover:bg-slate-100'
          )}
        >
          Sürekli
        </button>
        <button
          onClick={() => setMode('intermittent')}
          className={classNames(
            'rounded-2xl border px-3 py-2 text-xs font-bold transition',
            mode === 'intermittent'
              ? 'border-avuc-red bg-avuc-lightRed text-avuc-red'
              : 'border-avuc-line bg-slate-50 text-avuc-muted hover:bg-slate-100'
          )}
        >
          Kesikli
        </button>
      </div>

      <Button
        onClick={isPlaying ? stopAlarm : startAlarm}
        variant="reverse"
        className={classNames('mt-4 w-full min-h-12 rounded-2xl font-heading', isPlaying ? 'bg-avuc-red text-white animate-pulse' : 'bg-avuc-lightRed text-avuc-red')}
      >
        {isPlaying ? 'Sireni Durdur' : 'Sireni Çal'}
      </Button>
    </div>
  )
}

function MorseLed() {
  const [message, setMessage] = useState('SOS')
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [currentSignal, setCurrentSignal] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const textToMorse = (text) => {
    return text.toUpperCase().split('').map(ch => MORSE_CODE[ch] || '').join(' ')
  }

  const transmit = useCallback(async (fullscreen = false) => {
    if (isTransmitting) return
    setIsTransmitting(true)
    const morse = textToMorse(message)
    setCurrentSignal(morse)

    const container = document.getElementById(fullscreen ? 'morse-display-fullscreen' : 'morse-display')
    if (!container) { setIsTransmitting(false); return }

    for (let i = 0; i < morse.length; i++) {
      const ch = morse[i]
      if (ch === '.') {
        container.style.backgroundColor = '#ef4444'
        container.style.boxShadow = fullscreen ? '0 0 120px rgba(239,68,68,1)' : '0 0 60px rgba(239,68,68,0.8)'
        await new Promise(r => setTimeout(r, 200))
        container.style.backgroundColor = fullscreen ? '#000000' : '#1e293b'
        container.style.boxShadow = 'none'
        await new Promise(r => setTimeout(r, 200))
      } else if (ch === '-') {
        container.style.backgroundColor = '#ef4444'
        container.style.boxShadow = fullscreen ? '0 0 120px rgba(239,68,68,1)' : '0 0 60px rgba(239,68,68,0.8)'
        await new Promise(r => setTimeout(r, 600))
        container.style.backgroundColor = fullscreen ? '#000000' : '#1e293b'
        container.style.boxShadow = 'none'
        await new Promise(r => setTimeout(r, 200))
      } else if (ch === ' ') {
        await new Promise(r => setTimeout(r, 600))
      } else if (ch === '/') {
        await new Promise(r => setTimeout(r, 1000))
      }
    }
    setIsTransmitting(false)
  }, [message, isTransmitting])

  const startFullscreen = async () => {
    setIsFullscreen(true)
    await new Promise(r => setTimeout(r, 100))
    await transmit(true)
    setIsFullscreen(false)
  }

  return (
    <>
      <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
            <Flashlight className="h-7 w-7 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-avuc-text">Mors Kodu LED</h3>
            <p className="text-sm text-avuc-muted">Mesajınızı ışık sinyallerine dönüştürün</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-avuc-text mb-2">Mesaj</label>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={20}
            className="w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm font-base text-text shadow-shadow placeholder:text-slate-500"
            placeholder="SOS"
          />
        </div>

        <div
          id="morse-display"
          className="mt-4 flex h-24 items-center justify-center rounded-2xl bg-slate-800 transition-all duration-100"
        >
          <p className="text-xs font-mono text-slate-400 break-all px-4 text-center">
            {textToMorse(message)}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            onClick={() => transmit(false)}
            disabled={isTransmitting}
            variant="reverse"
            className="min-h-12 rounded-2xl bg-amber-500 font-heading text-white disabled:opacity-50"
          >
            {isTransmitting ? 'İletiliyor...' : 'Işık ile İlet'}
          </Button>
          <Button
            onClick={startFullscreen}
            disabled={isTransmitting}
            variant="reverse"
            className="min-h-12 rounded-2xl bg-slate-800 font-heading text-white disabled:opacity-50"
          >
            <Flashlight className="mr-2 h-4 w-4" />
            Tam Ekran LED
          </Button>
        </div>
      </div>

      {isFullscreen && (
        <div
          id="morse-display-fullscreen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-colors duration-100"
        >
          <button
            onClick={() => { setIsFullscreen(false); setIsTransmitting(false) }}
            className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            Kapat
          </button>
          <div className="text-center">
            <p className="mb-6 text-lg font-bold text-white/70">Mors: {textToMorse(message)}</p>
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/20">
              <Flashlight className="h-16 w-16 text-white/40" />
            </div>
            <p className="text-sm text-white/50">Sinyal iletiliyor...</p>
          </div>
        </div>
      )}
    </>
  )
}

function LocationShare({ onToast }) {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const { permission, showHelp, setShowHelp, checkPermission } = useLocationPermission()

  const getLocation = () => {
    setLoading(true)
    if (!navigator.geolocation) {
      onToast('Tarayıcınız konum desteklemiyor.')
      setLoading(false)
      return
    }
    if (permission === 'denied') {
      setShowHelp(true)
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setLocation({ lat, lng })
        setLoading(false)
        onToast(`Konum alındı: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      },
      (err) => {
        let msg = 'Konum alınamadı.'
        if (err.code === 1) {
          msg = 'Konum izni reddedildi.'
          setShowHelp(true)
        } else if (err.code === 2) msg = 'Konum bilgisi bulunamadı. GPS veya WiFi açık olduğundan emin olun.'
        else if (err.code === 3) msg = 'Konum alma zaman aşımına uğradı. Tekrar deneyin.'
        onToast(msg)
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    )
  }

  const handleManualLocation = (lat, lng) => {
    setLocation({ lat, lng })
    setShowHelp(false)
    onToast(`Manuel konum ayarlandı: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  }

  const shareWhatsApp = () => {
    if (!location) return
    const text = encodeURIComponent(`Acil durum! Konumum: https://maps.google.com/?q=${location.lat},${location.lng}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareSms = () => {
    if (!location) return
    const text = `Acil durum! Konumum: https://maps.google.com/?q=${location.lat},${location.lng}`
    window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <>
      <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <MapPin className="h-7 w-7 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-avuc-text">Konum Paylaş</h3>
            <p className="text-sm text-avuc-muted">Anlık konumunuzu paylaşın</p>
          </div>
        </div>

        {permission === 'denied' && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs text-amber-700">
            <p className="font-bold">Konum izni kapalı.</p>
            <button onClick={() => setShowHelp(true)} className="mt-1 text-avuc-blue underline">Nasıl açılır?</button>
          </div>
        )}

        <Button
          onClick={getLocation}
          disabled={loading}
          variant="default"
          className="mt-4 w-full min-h-12 rounded-2xl font-heading"
        >
          {loading ? 'Konum alınıyor...' : 'Konumumu Al'}
        </Button>

        {location && (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold text-avuc-muted">Enlem / Boylam</p>
              <p className="mt-1 text-lg font-black text-avuc-text">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={shareWhatsApp} variant="reverse" className="rounded-2xl bg-green-500 font-heading text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button onClick={shareSms} variant="neutral" className="rounded-2xl font-heading">
                <Send className="mr-2 h-4 w-4" />
                SMS
              </Button>
            </div>
          </div>
        )}
      </div>
      {showHelp && <LocationPermissionGuide onClose={() => setShowHelp(false)} onManualLocation={handleManualLocation} />}
    </>
  )
}

function EmergencyNumbers() {
  const [search, setSearch] = useState('')
  const filtered = EMERGENCY_NUMBERS.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.number.includes(search)
  )

  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Phone className="h-7 w-7 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-avuc-text">Acil Durum Numaraları</h3>
          <p className="text-sm text-avuc-muted">Tek tıkla arama yapın</p>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Ara..."
        className="mb-4 w-full rounded-2xl border border-border bg-bw px-4 py-3 text-sm shadow-shadow placeholder:text-slate-500"
      />

      <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-1">
        {filtered.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between rounded-2xl border border-avuc-line bg-slate-50 p-4 transition hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className={classNames('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', item.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-avuc-text">{item.name}</p>
                  <p className="text-xs text-avuc-muted">{item.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-avuc-text">{item.number}</p>
                {item.urgent && <Badge className="mt-1 border-red-200 bg-red-50 text-red-600">Acil</Badge>}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function QuickReport({ onToast, onLoginRequired }) {
  const [disasterType, setDisasterType] = useState('')
  const [loading, setLoading] = useState(false)
  const { isLoggedIn } = useAuth()
  const types = [
    { id: 'flood', label: 'Sel / Su Baskını', icon: Waves, color: 'bg-blue-500' },
    { id: 'earthquake', label: 'Deprem', icon: Activity, color: 'bg-red-500' },
    { id: 'fire', label: 'Yangın', icon: Flame, color: 'bg-orange-500' },
    { id: 'landslide', label: 'Heyelan', icon: AlertTriangle, color: 'bg-amber-600' },
    { id: 'storm', label: 'Fırtına / Hortum', icon: Wind, color: 'bg-cyan-500' },
    { id: 'other', label: 'Diğer', icon: AlertTriangle, color: 'bg-slate-500' },
  ]

  const submit = async () => {
    if (!disasterType) {
      onToast('Lütfen bir afet türü seçin')
      return
    }
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    setLoading(true)
    try {
      const typeLabel = types.find(t => t.id === disasterType)?.label
      await api.post('/listings', {
        type: 'urgent',
        category: 'Acil ihtiyaç bildiriyorum',
        city: 'Bilinmiyor',
        district: 'Bilinmiyor',
        location: 'Bilinmiyor',
        title: `${typeLabel} ihbarı`,
        description: `Anlık afet ihbarı: ${typeLabel}. Konum bilgisi henüz girilmemiş.`,
        status: 'PENDING',
      })
      onToast(`${typeLabel} ihbarı alındı! En yakın ekip yönlendiriliyor.`)
      setDisasterType('')
    } catch (err) {
      onToast(err.response?.data?.message || 'İhbar gönderilemedi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-avuc-text">Anlık Afet İhbarı</h3>
          <p className="text-sm text-avuc-muted">Bölgenizdeki afeti bildirin</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {types.map((t) => {
          const Icon = t.icon
          const selected = disasterType === t.id
          return (
            <button
              key={t.id}
              onClick={() => setDisasterType(t.id)}
              className={classNames(
                'flex flex-col items-center gap-2 rounded-2xl border p-3 transition',
                selected ? 'border-avuc-red bg-avuc-lightRed' : 'border-avuc-line bg-slate-50 hover:bg-slate-100'
              )}
            >
              <div className={classNames('flex h-10 w-10 items-center justify-center rounded-xl', selected ? t.color : 'bg-slate-200')}>
                <Icon className={classNames('h-5 w-5', selected ? 'text-white' : 'text-slate-500')} />
              </div>
              <span className={classNames('text-[11px] font-bold', selected ? 'text-avuc-red' : 'text-avuc-muted')}>{t.label}</span>
            </button>
          )
        })}
      </div>

      <Button
        onClick={submit}
        disabled={loading}
        variant="reverse"
        className="mt-5 w-full min-h-12 rounded-2xl bg-avuc-red font-heading text-white disabled:opacity-50"
      >
        <Siren className="mr-2 h-4 w-4" />
        {loading ? 'Gönderiliyor...' : 'İhbar Gönder'}
      </Button>
    </div>
  )
}

export default function EmergencyHub({ onToast, onLoginRequired }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge className="border-red-200 bg-red-50 text-red-600">Acil Durum Merkezi</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-avuc-text sm:text-4xl">
          Anlık Yardım ve İhbar Araçları
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-avuc-muted">
          Afet anında kullanabileceğiniz tüm acil araçları tek yerde. Siren, mors kodu, konum paylaşımı ve anlık ihbar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <QuickReport onToast={onToast} onLoginRequired={onLoginRequired} />
        <SosAlarm />
        <MorseLed />
        <LocationShare onToast={onToast} />
        <EmergencyNumbers />
        <div className="rounded-[2rem] border border-avuc-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
              <Radio className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-avuc-text">Acil Radyo</h3>
              <p className="text-sm text-avuc-muted">Anlık afet yayınları</p>
            </div>
          </div>
          <p className="text-sm text-avuc-muted">
            TRT Radyo 1 ve AFAD frekansları üzerinden anlık yayınlar. Radyo sayfasına gidin.
          </p>
        </div>
      </div>
    </main>
  )
}
