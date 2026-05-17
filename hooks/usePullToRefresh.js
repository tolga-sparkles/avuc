import { useEffect } from 'react'

export function usePullToRefresh(onRefresh, options = {}) {
  const { threshold = 100 } = options

  useEffect(() => {
    let startY = 0
    let isPulling = false

    const onTouchStart = (e) => {
      if (window.scrollY > 0) return
      startY = e.touches[0].clientY
      isPulling = true
    }

    const onTouchMove = (e) => {
      if (!isPulling) return
      const y = e.touches[0].clientY
      const diff = y - startY
      if (diff > threshold) {
        isPulling = false
        onRefresh?.()
      }
    }

    const onTouchEnd = () => {
      isPulling = false
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onRefresh, threshold])
}
