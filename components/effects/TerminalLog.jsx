import { useEffect, useState } from 'react'

export function TerminalLog() {
  const [lines, setLines] = useState([
    '[14:32:01] Sunucuya bağlanıyor...',
    '[14:32:02] WebSocket kanalı açıldı',
    '[14:32:04] 3 yeni ihbar alındı (Hatay)',
  ])

  const ALL_LOGS = [
    '[14:32:08] Konum verisi senkronize edildi',
    '[14:32:15] AI hasar analizi tamamlandı',
    '[14:32:22] Yedek veritabanı aktif',
    '[14:32:30] Gönüllü rotası optimize edildi',
    '[14:32:45] Depo envanteri güncellendi',
    '[14:33:01] Acil durum bildirimi aktarıldı',
    '[14:33:12] Sistem yükü: %34',
    '[14:33:25] Harita katmanı yenilendi',
  ]

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setLines((prev) => [...prev.slice(1), ALL_LOGS[i % ALL_LOGS.length]])
      i++
    }, 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-green-400">
      <div className="mb-1 text-[10px] text-slate-500 uppercase tracking-wider">Sistem Logları</div>
      {lines.map((l, idx) => (
        <div key={idx} className="opacity-80">{l}</div>
      ))}
      <span className="mt-1 inline-block h-3 w-1.5 animate-pulse bg-green-400" />
    </div>
  )
}
