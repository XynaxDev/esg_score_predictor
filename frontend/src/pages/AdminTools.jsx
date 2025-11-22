import { useState } from 'react'
import { api } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { Shield, Database, Loader2 } from 'lucide-react'

export default function AdminTools() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { ok, message, details }
  const navigate = useNavigate()

  const seed = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await api.auth.seedTestUser()
      setResult({ ok: true, message: res.message || 'Seeded test user', details: res })
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Seeding failed'
      setResult({ ok: false, message: msg, details: e?.response?.data })
    } finally {
      setLoading(false)
    }
  }

  const goDash = () => {
    // Inform listeners that active dataset may have changed
    window.dispatchEvent(new Event('dataset:updated'))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[60vh] px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/30"><Shield className="h-5 w-5 text-primary-400"/></div>
          <h1 className="text-2xl font-bold text-gray-100">Admin Tools</h1>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2"><Database className="h-5 w-5 text-gray-400"/> Seed Test User & Demo Dataset</h2>
          <p className="text-sm text-gray-400 mt-1">Create or reset a verified test user and attach the local demo dataset as the active dataset.</p>
          <p className="text-xs text-amber-400 mt-2">Requires backend env ALLOW_SEED=true or FLASK_ENV=development.</p>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={seed} disabled={loading} className="rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 text-white font-semibold inline-flex items-center gap-2">
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin"/> Seeding…</>) : 'Seed test user'}
            </button>
            {result?.ok && (
              <button onClick={goDash} className="rounded-lg border border-dark-700 px-4 py-2 text-gray-200 hover:bg-dark-800">Go to Dashboard</button>
            )}
          </div>

          {result && (
            <div className={`mt-4 rounded-md border px-3 py-2 text-sm ${result.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
              {result.message}
              {result.ok && result.details?.credentials && (
                <div className="mt-2 text-xs text-gray-300">Email: {result.details.credentials.email} · Password: {result.details.credentials.password}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
