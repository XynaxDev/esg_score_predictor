import { useEffect, useState } from 'react'
import { api } from '../utils/api'

export default function DevStatus() {
  const [state, setState] = useState({ ok: null, ms: null })

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const r = await api.ping()
        if (!mounted) return
        setState({ ok: r.ok, ms: r.ok ? Math.round(r.ms) : null })
      } catch {
        if (!mounted) return
        setState({ ok: false, ms: null })
      }
    }
    run()
    const id = setInterval(run, 30000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  if (!import.meta.env.DEV) return null

  const color = state.ok === null ? 'bg-yellow-400' : state.ok ? 'bg-emerald-400' : 'bg-red-400'
  const label = state.ok === null ? 'Checking' : state.ok ? `API: Up${state.ms != null ? ` • ${state.ms}ms` : ''}` : 'API: Down'

  return (
    <div className="hidden md:flex items-center gap-2 rounded-full border border-dark-700/70 bg-dark-800/70 px-3 py-1 text-xs text-gray-300">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}
