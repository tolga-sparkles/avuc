import { useEffect, useState, useCallback } from 'react'
import { api } from '@/services/api'

export function useDisasterReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/reports')
      setReports(data.data || [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'İhbarlar alınamadı'
      console.error('[useDisasterReports] fetch error:', msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        setLoading(true)
        setError(null)
        const { data } = await api.get('/reports')
        if (!cancelled) setReports(data.data || [])
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'İhbarlar alınamadı'
        console.error('[useDisasterReports] fetch error:', msg)
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    const interval = setInterval(run, 60000)

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

  return { reports, loading, error, refetch: fetchReports }
}
