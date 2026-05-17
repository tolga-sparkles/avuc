import { useEffect, useState } from 'react'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/layout/Badge'
import { PrimaryButton } from '@/components/layout/PrimaryButton'
import { EmptyState } from '@/components/layout/EmptyState'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export default function VolunteerPage({ onToast, onLoginRequired }) {
  const [tasks, setTasks] = useState([])
  const [joined, setJoined] = useState([])
  const [loading, setLoading] = useState(true)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    api.get('/tasks')
      .then(({ data }) => setTasks(data || []))
      .catch(() => onToast('Gönüllü görevleri yüklenirken hata oluştu'))
      .finally(() => setLoading(false))
  }, [onToast])

  const handleJoin = async (task) => {
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    try {
      await api.post(`/tasks/${task.id}/join`)
      setJoined((current) => [...current, task.id])
      onToast(`${task.title} görevine katıldınız`)
      const { data } = await api.get('/tasks')
      setTasks(data || [])
    } catch {
      onToast('Göreve katılırken hata oluştu')
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Gönüllü ağı"
        title="Gönüllü görevleri"
        description="Paketleme, dağıtım, araçla taşıma, depo düzenleme ve özel destek görevlerine katılın."
      />
      {loading ? (
        <div className="flex items-center justify-center py-20 text-avuc-muted">Yükleniyor...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => {
            const isJoined = joined.includes(task.id)
            return (
              <article key={task.id} className="card-hover rounded-[2rem] border border-avuc-line bg-white p-5 shadow-soft">
                <Badge className="border-avuc-blue/20 bg-avuc-lightBlue text-avuc-darkBlue">{task.location}</Badge>
                <h3 className="mt-4 text-xl font-black text-avuc-text">{task.title}</h3>
                <p className="mt-2 text-sm font-semibold text-avuc-muted">{task.time}</p>
                <p className="mt-4 text-sm leading-6 text-avuc-muted">{task.description}</p>
                <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-avuc-text">Gerekli kişi sayısı: {task.people}</div>
                <PrimaryButton
                  variant={isJoined ? 'green' : 'blue'}
                  className="mt-5 w-full"
                  onClick={() => handleJoin(task)}
                >
                  {isJoined ? 'Katılım alındı' : 'Katıl'}
                </PrimaryButton>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
