import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('SW registered:', reg.scope)
      })
      .catch((err) => {
        console.log('SW registration failed:', err)
      })
  }, [])
}
