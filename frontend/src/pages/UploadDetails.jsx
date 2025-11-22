import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { FiDownload, FiPlay, FiChevronLeft } from 'react-icons/fi'

export default function UploadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ upload: null, columns: [], sample: [] })
  const [downloading, setDownloading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.analytics.uploadPreview(id)
      setData({ upload: res.upload, columns: res.columns || [], sample: res.sample || [] })
    } catch (e) {
      setError(e?.message || 'Failed to load upload')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      await api.analytics.uploadAnalyze(id)
      // notify layout to refresh active dataset chip
      window.dispatchEvent(new Event('dataset:updated'))
      navigate('/dashboard')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const d = await api.analytics.uploadDownload(id, 'csv')
      const blob = new Blob([d.content || ''], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = d.filename || 'dataset.csv'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
          <FiChevronLeft /> Back
        </button>
      </div>

      {loading && <div className="text-gray-400">Loading...</div>}
      {error && <div className="text-sm text-red-300">{error}</div>}

      {!loading && data.upload && (
        <>
          <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-100">{data.upload.filename}</h1>
                <p className="text-xs text-gray-400">{(data.upload.row_count || 0).toLocaleString()} rows · {data.columns.length} columns · {data.upload.created_at ? new Date(data.upload.created_at).toLocaleString() : ''}</p>
                <p className="mt-1 text-xs text-gray-500">After Analyze, the dashboard uses this dataset and shows it at the top as “Dataset: {data.upload.filename}”.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleAnalyze} disabled={analyzing} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-60 px-3 py-2 text-sm text-white">
                  <FiPlay /> {analyzing ? 'Analyzing...' : 'Analyze'}
                </button>
                <button onClick={handleDownload} disabled={downloading} className="inline-flex items-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 px-3 py-2 text-sm text-gray-200">
                  <FiDownload /> {downloading ? 'Downloading...' : 'Download CSV'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5">
            <h2 className="text-lg font-semibold text-gray-100 mb-3">Preview (first 10 rows)</h2>
            {data.sample && data.sample.length > 0 ? (
              <div className="overflow-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      {data.columns.map((c) => (
                        <th key={c} className="px-2 py-1 text-left text-gray-400 bg-dark-800 sticky top-0">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data.sample || []).map((row, idx) => (
                      <tr key={idx} className="odd:bg-dark-900 even:bg-dark-900/60">
                        {data.columns.map((c) => (
                          <td key={c} className="px-2 py-1 text-gray-200 whitespace-nowrap">{String(row?.[c] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                No preview rows available. Click <span className="text-gray-200 font-medium">Analyze</span> to use this dataset across dashboard sections.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
