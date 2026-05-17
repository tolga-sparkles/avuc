import { useEffect, useState } from 'react'

export function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = Math.max(1, Math.ceil(Number(target) / (duration / 16)))
    const id = setInterval(() => {
      start += step
      if (start >= Number(target)) {
        start = Number(target)
        clearInterval(id)
      }
      setCount(start)
    }, 16)
    return () => clearInterval(id)
  }, [target, duration])

  return <span>{typeof target === 'string' && target.includes('%') ? `${count}%` : count.toLocaleString()}{suffix}</span>
}
