import { useEffect, useState, useCallback } from 'react'
import { api } from '@/services/api'

export function useDisasterReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/reports')
      setReports(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'İhbarlar alınamadı')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        setLoading(true)
        const { data } = await api.get('/reports')
        if (!cancelled) setReports(data.data || [])
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'İhbarlar alınamadı')
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
