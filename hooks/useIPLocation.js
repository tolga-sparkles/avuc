import { useEffect, useState } from 'react'

export function useIPLocation() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLocation() {
      try {
        // ipapi.co — ücretsiz, 45bin req/ay, CORS açık
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
        if (!res.ok) throw new Error('Konum servisi yanıt vermedi')
        const data = await res.json()
        if (cancelled) return
        setLocation({
          city: data.city,
          region: data.region,
          country: data.country_name,
          lat: data.latitude,
          lon: data.longitude,
          ip: data.ip,
        })
      } catch (err) {
        if (!cancelled) setError(err.message || 'Konum alınamadı')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLocation()
    return () => { cancelled = true }
  }, [])

  return { location, loading, error }
}
