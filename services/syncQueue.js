const QUEUE_KEY = 'avuc_sync_queue'

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch {
    return []
  }
}

function setQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function enqueueRequest(config) {
  const queue = getQueue()
  queue.push({
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    url: config.url,
    method: config.method || 'POST',
    data: config.data,
    headers: config.headers || {},
    timestamp: Date.now(),
  })
  setQueue(queue)
}

export function getQueueLength() {
  return getQueue().length
}

export async function flushQueue(apiInstance, onResult) {
  const queue = getQueue()
  if (!queue.length) return

  const remaining = []
  for (const item of queue) {
    try {
      await apiInstance({
        url: item.url,
        method: item.method,
        data: item.data,
        headers: item.headers,
      })
      onResult?.({ success: true, item })
    } catch (err) {
      // Kalıcı hata ise (401 gibi) tekrar deneme
      if (err.response?.status === 401) {
        remaining.push(item)
      } else {
        remaining.push(item)
        onResult?.({ success: false, item, error: err })
      }
    }
  }
  setQueue(remaining)
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY)
}
