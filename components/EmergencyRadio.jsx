import { useState, useRef, useEffect, useCallback } from 'react'
import { Radio, Play, Pause, Volume2, VolumeX, AlertTriangle, Headphones, Globe, Music } from 'lucide-react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const STATIONS = [
  {
    id: 'bbc-world',
    name: 'BBC World Service',
    desc: '24/7 Global news & emergency info (English)',
    country: 'UK',
    stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
  },
  {
    id: 'npr-news',
    name: 'NPR News',
    desc: 'US Public Radio — breaking news (English)',
    country: 'USA',
    stream: 'https://npr-ice.streamguys1.com/live.mp3',
  },
  {
    id: 'rfi-monde',
    name: 'RFI Monde',
    desc: 'Radio France Internationale (French)',
    country: 'France',
    stream: 'https://live02.rfi.fr/rfimonde-96k.mp3',
  },
  {
    id: 'dw-radio',
    name: 'DW News',
    desc: 'Deutsche Welle — global news (English)',
    country: 'Germany',
    stream: 'https://dw.audiostream.io/dw/1028/mp3/64/dw07',
  },
  {
    id: 'trt-radyo1',
    name: 'TRT Radyo 1',
    desc: 'Turkish official emergency broadcasts',
    country: 'Turkey',
    stream: 'https://nmicenotrt.mediatriple.net/trt_radyo_1.aac',
  },
  {
    id: 'rne',
    name: 'RNE Radio Nacional',
    desc: 'Spain national radio (Spanish)',
    country: 'Spain',
    stream: 'https://crtve-rne1.stream.flumotion.com/rne1/stream.mp3',
  },
]

function Visualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const bars = 32
    const barWidth = width / bars

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < bars; i++) {
      const intensity = isPlaying ? Math.random() * 0.7 + 0.3 : 0.1
      const barHeight = intensity * height * 0.8
      const x = i * barWidth
      const y = height - barHeight

      const gradient = ctx.createLinearGradient(0, y, 0, height)
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)')
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.15)')

      ctx.fillStyle = gradient
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [audioRef, isPlaying])

  useEffect(() => {
    if (isPlaying) {
      draw()
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, draw])

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={48}
      className="w-full rounded-xl bg-slate-50"
    />
  )
}

export default function EmergencyRadio({ compact = false }) {
  const [activeStation, setActiveStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.crossOrigin = 'anonymous'
    audioRef.current.volume = volume

    const audio = audioRef.current
    const handleCanPlay = () => { setLoading(false); setIsPlaying(true) }
    const handleError = () => { setLoading(false); setError(true); setIsPlaying(false) }
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playStation = (station) => {
    if (activeStation?.id === station.id && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }
    setError(false)
    setLoading(true)
    setActiveStation(station)
    audioRef.current.src = station.stream
    audioRef.current.load()
    audioRef.current.play().catch((err) => {
      console.error('Audio play error:', err)
      setLoading(false)
      setError(true)
      setIsPlaying(false)
    })
  }

  const togglePlay = () => {
    if (!activeStation) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => setError(true))
      setIsPlaying(true)
    }
  }

  const playerCard = (
    <div className="rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className={classNames('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', activeStation ? 'bg-purple-100' : 'bg-slate-100')}>
          {activeStation ? <Radio className="h-6 w-6 text-purple-600" /> : <Headphones className="h-6 w-6 text-slate-400" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-avuc-text truncate">{activeStation ? activeStation.name : 'İstasyon Seçin'}</h3>
          <p className="text-xs text-avuc-muted truncate">{activeStation ? activeStation.desc : 'Yayın başlatmak için kanal seçin'}</p>
          {activeStation && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              <Globe className="h-3 w-3" />
              {activeStation.country}
            </span>
          )}
        </div>
        <button
          onClick={togglePlay}
          disabled={!activeStation || loading}
          className={classNames(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95',
            activeStation ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600' : 'bg-slate-200 text-slate-400',
          )}
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </button>
      </div>

      <div className="mt-4">
        <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Yayın yüklenemedi. Başka istasyon deneyin.
        </div>
      )}

      {activeStation && (
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => setVolume((v) => Math.max(0, v - 0.1))} className="active:scale-95">
            <VolumeX className="h-4 w-4 text-avuc-muted" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-purple-500"
          />
          <button onClick={() => setVolume((v) => Math.min(1, v + 0.1))} className="active:scale-95">
            <Volume2 className="h-4 w-4 text-avuc-muted" />
          </button>
          <span className="w-8 text-right text-[11px] font-bold text-avuc-muted">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  )

  const stationList = (
    <div className="grid gap-2">
      {STATIONS.map((station) => {
        const isActive = activeStation?.id === station.id
        return (
          <button
            key={station.id}
            onClick={() => playStation(station)}
            className={classNames(
              'flex items-center justify-between rounded-2xl border p-3 text-left transition active:scale-[0.98]',
              isActive ? 'border-purple-300 bg-purple-50/60' : 'border-avuc-line bg-white hover:bg-slate-50',
            )}
          >
            <div className="flex items-center gap-3">
              <div className={classNames('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', isActive ? 'bg-purple-500' : 'bg-slate-100')}>
                {isActive && isPlaying ? <Music className="h-4 w-4 text-white animate-pulse" /> : <Radio className={classNames('h-4 w-4', isActive ? 'text-white' : 'text-slate-400')} />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className={classNames('text-sm font-bold', isActive ? 'text-purple-700' : 'text-avuc-text')}>
                    {station.name}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {station.country}
                  </span>
                </div>
                <p className="text-xs text-avuc-muted">{station.desc}</p>
              </div>
            </div>
            {isActive && isPlaying && (
              <div className="flex items-center gap-1">
                {[0, 75, 150].map((delay) => (
                  <span key={delay} className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500" style={{ animationDelay: `${delay}ms` }} />
                ))}
                <span className="ml-1 text-[10px] font-black text-purple-600 uppercase tracking-wider">Live</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )

  if (compact) {
    return (
      <div className="space-y-3">
        {playerCard}
        {stationList}
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-600">
          <Globe className="h-3.5 w-3.5" />
          Acil Durum Radyosu
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-avuc-text sm:text-4xl">
          Global Afet ve Haber Yayınları
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-avuc-muted">
          Dünya çapında resmi radyo istasyonlarından anlık haber ve acil durum bilgilendirmeleri.
        </p>
      </div>
      {playerCard}
      <div className="mt-4">
        {stationList}
      </div>
    </main>
  )
}
