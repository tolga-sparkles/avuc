import { useEffect, useState } from 'react'

export function ScreenShake({ trigger }) {
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (!trigger) return
    setShaking(true)
    const t = setTimeout(() => setShaking(false), 600)
    return () => clearTimeout(t)
  }, [trigger])

  if (!shaking) return null
  return (
    <style>{`
      @keyframes shake {
        0%,100%{transform:translate(0,0)}
        10%{transform:translate(-5px,-5px)}
        20%{transform:translate(5px,5px)}
        30%{transform:translate(-5px,5px)}
        40%{transform:translate(5px,-5px)}
        50%{transform:translate(-3px,3px)}
        60%{transform:translate(3px,-3px)}
      }
      body { animation: shake 0.6s ease-in-out; }
    `}</style>
  )
}
