import { useEffect, useState, useCallback } from 'react'
import { api } from '@/services/api'

export function useEarthquakes() {
  const [quakes, setQuakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQuakes = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/earthquakes')
      setQuakes((data.data || []).slice(0, 12))
    } catch (err) {
      setError(err.response?.data?.message || 'Deprem verisi alınamadı')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        setLoading(true)
        const { data } = await api.get('/earthquakes')
        if (!cancelled) {
          setQuakes((data.data || []).slice(0, 12))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Deprem verisi alınamadı')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    const interval = setInterval(run, 120000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') run()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', run)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', run)
    }
  }, [])

  return { quakes, loading, error, refetch: fetchQuakes }
}
