import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../auth/AuthContext'
import { FiUser, FiMail, FiPhone, FiBriefcase, FiDownload, FiSettings, FiFileText, FiCamera, FiTrash2, FiCheckCircle, FiCalendar } from 'react-icons/fi'

function toCSV(rows) {
  if (!rows || !rows.length) return ''
  const headers = Array.from(rows.reduce((set, r) => {
    Object.keys(r || {}).forEach(k => set.add(k))
    return set
  }, new Set()))
  const esc = (v) => {
    const s = typeof v === 'object' ? JSON.stringify(v) : (v ?? '')
    const str = String(s)
    return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str
  }
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map(h => esc(row[h])).join(','))
  }
  return lines.join('\n')
}

function download(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Profile() {
  const { user, setUser } = useAuth()
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState({})
  const [exportSuccess, setExportSuccess] = useState('')
  const navigate = useNavigate()
  const fileRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.auth.me()
        setMe(res.user)
        if (res.user) setUser(res.user)
      } catch (e) {
        setErr(e?.response?.data?.error || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('Please select an image')
    if (file.size > 2 * 1024 * 1024) return alert('Image must be under 2MB')
    setAvatarLoading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const res = await api.auth.uploadAvatar(reader.result)
        setMe(res.user)
        setUser(res.user)
      } catch (e) {
        alert(e?.response?.data?.error || 'Failed to upload avatar')
      } finally {
        setAvatarLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = async () => {
    setAvatarLoading(true)
    try {
      const res = await api.auth.deleteAvatar()
      setMe(res.user)
      setUser(res.user)
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to remove avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  const exportDatasetCSV = async () => {
    setExportLoading(l => ({ ...l, dcsv: true }))
    try {
      const data = await api.analytics.exportDataset({})
      const csv = toCSV(data.data || [])
      download(csv, 'dataset.csv', 'text/csv')
      setExportSuccess('Dataset CSV downloaded')
      setTimeout(() => setExportSuccess(''), 3000)
    } catch (e) {
      alert('Export failed')
    } finally {
      setExportLoading(l => ({ ...l, dcsv: false }))
    }
  }
  const exportDatasetJSON = async () => {
    setExportLoading(l => ({ ...l, djson: true }))
    try {
      const data = await api.analytics.exportDataset({})
      download(JSON.stringify(data, null, 2), 'dataset.json', 'application/json')
      setExportSuccess('Dataset JSON downloaded')
      setTimeout(() => setExportSuccess(''), 3000)
    } catch (e) {
      alert('Export failed')
    } finally {
      setExportLoading(l => ({ ...l, djson: false }))
    }
  }
  const exportPredsCSV = async () => {
    setExportLoading(l => ({ ...l, pcsv: true }))
    try {
      const res = await api.analytics.listPredictions()
      const csv = toCSV(res.items || [])
      download(csv, 'predictions.csv', 'text/csv')
      setExportSuccess('Predictions CSV downloaded')
      setTimeout(() => setExportSuccess(''), 3000)
    } catch (e) {
      alert('Export failed')
    } finally {
      setExportLoading(l => ({ ...l, pcsv: false }))
    }
  }
  const exportPredsJSON = async () => {
    setExportLoading(l => ({ ...l, pjson: true }))
    try {
      const res = await api.analytics.listPredictions()
      download(JSON.stringify(res.items || [], null, 2), 'predictions.json', 'application/json')
      setExportSuccess('Predictions JSON downloaded')
      setTimeout(() => setExportSuccess(''), 3000)
    } catch (e) {
      alert('Export failed')
    } finally {
      setExportLoading(l => ({ ...l, pjson: false }))
    }
  }

  return (
    <div className="min-h-[70vh] px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {loading && <div className="text-gray-400 text-sm">Loading...</div>}
        {err && <div className="text-red-300 text-sm">{err}</div>}
        {me && (
          <>
            <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-600/80 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                    {me.avatar ? <img src={me.avatar} alt="avatar" className="w-full h-full object-cover" /> : (me.full_name?.[0] || me.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} disabled={avatarLoading} className="absolute bottom-0 right-0 p-1.5 bg-primary-600 hover:bg-primary-500 rounded-full text-white disabled:opacity-50"><FiCamera className="h-4 w-4"/></button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-100">{me.full_name || 'User'}</h1>
                    {me.is_verified && <FiCheckCircle className="h-5 w-5 text-emerald-400" title="Verified"/>}
                  </div>
                  <p className="text-sm text-gray-400">{me.email}</p>
                  {me.created_at && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><FiCalendar className="h-3 w-3"/> Joined {new Date(me.created_at).toLocaleDateString()}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => navigate('/settings')} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 px-3 py-1.5 text-sm text-white font-semibold"><FiSettings/> Edit Profile</button>
                    {me.avatar && <button onClick={removeAvatar} disabled={avatarLoading} className="inline-flex items-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 px-3 py-1.5 text-sm text-gray-200 disabled:opacity-50"><FiTrash2/> Remove Avatar</button>}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg"><FiPhone className="text-primary-400"/></div>
                  <div><div className="text-xs text-gray-400">Phone</div><div className="text-gray-100 font-medium">{me.phone || 'Not set'}</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg"><FiBriefcase className="text-primary-400"/></div>
                  <div><div className="text-xs text-gray-400">Company</div><div className="text-gray-100 font-medium">{me.company_name || 'Not set'}</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg"><FiMail className="text-primary-400"/></div>
                  <div><div className="text-xs text-gray-400">Email updates</div><div className="text-gray-100 font-medium">{me.prefs?.email_updates ? 'Enabled' : 'Disabled'}</div></div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-100 mb-1">Data Exports</h2>
              <p className="text-sm text-gray-400 mb-4">Download your dataset and predictions for offline analysis.</p>
              {exportSuccess && <div className="mb-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm">{exportSuccess}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={exportDatasetCSV} disabled={exportLoading.dcsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2.5 text-white font-semibold"><FiDownload/> {exportLoading.dcsv ? 'Exporting...' : 'Dataset CSV'}</button>
                <button onClick={exportDatasetJSON} disabled={exportLoading.djson} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50 px-4 py-2.5 text-gray-200"><FiFileText/> {exportLoading.djson ? 'Exporting...' : 'Dataset JSON'}</button>
                <button onClick={exportPredsCSV} disabled={exportLoading.pcsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2.5 text-white font-semibold"><FiDownload/> {exportLoading.pcsv ? 'Exporting...' : 'Predictions CSV'}</button>
                <button onClick={exportPredsJSON} disabled={exportLoading.pjson} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50 px-4 py-2.5 text-gray-200"><FiFileText/> {exportLoading.pjson ? 'Exporting...' : 'Predictions JSON'}</button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
