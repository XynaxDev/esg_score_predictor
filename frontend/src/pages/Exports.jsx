import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { FiUpload, FiDownload, FiFileText, FiAlertCircle, FiCheckCircle, FiX, FiClock, FiDatabase, FiSearch, FiEye, FiPlay, FiTrash2 } from 'react-icons/fi'
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
  const lines = [headers.map(esc).join(',')]
  for (const row of rows) {
    lines.push(headers.map(h => esc(row[h])).join(','))
  }
  return lines.join('\n')
}

const download = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function parseFile(file) {
  const text = await file.text()
  const rows = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (rows.length < 2) throw new Error('CSV must have at least header and one row')
  const header = rows[0].split(',').map(h => h.trim().replace(/^\"|\"$/g, ''))
  const missing = REQUIRED_FEATURES.filter(f => !header.includes(f))
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`)
  }
  const data = []
  for (let i = 1; i < rows.length; i++) {
    const vals = rows[i].split(',').map(v => v.trim().replace(/^\"|\"$/g, ''))
    const obj = {}
    header.forEach((h, idx) => { obj[h] = vals[idx] || '' })
    data.push(obj)
  }
  return { header, data }
}

const REQUIRED_FEATURES = [
  'CompanyName',
  'Industry',
  'Region',
  'Year',
  'Revenue',
  'ESG_Overall',
  'ESG_Environmental',
  'ESG_Social',
  'ESG_Governance'
]

export default function Exports() {
  const navigate = useNavigate()
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [exportLoading, setExportLoading] = useState({})
  const [exportSuccess, setExportSuccess] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploads, setUploads] = useState([])
  const [uploadsLoading, setUploadsLoading] = useState(false)
  const [uploadsPage, setUploadsPage] = useState(1)
  const [uploadsLimit] = useState(5)
  const [uploadsTotal, setUploadsTotal] = useState(0)
  const [uploadsSearch, setUploadsSearch] = useState('')
  const [preview, setPreview] = useState(null) // { upload, columns, sample }
  const [parsed, setParsed] = useState({ header: [], data: [] })
  const [deleteItem, setDeleteItem] = useState(null) // { id, filename }

  const loadUploads = async () => {
    setUploadsLoading(true)
    try {
      const res = await api.analytics.listUploads({ page: uploadsPage, limit: uploadsLimit, search: uploadsSearch })
      setUploads(res.items || [])
      setUploadsTotal(res.total || 0)
    } catch {
      // ignore
    } finally {
      setUploadsLoading(false)
    }
  }

  useEffect(() => { loadUploads() }, [uploadsPage, uploadsSearch])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setUploadError('File too large. Max 10MB allowed.')
      setUploadedFile(null)
      setShowDisclaimer(false)
      return
    }
    setUploadedFile(file)
    setShowDisclaimer(true)
    setUploadError('')
    setUploadStatus('')
  }

  const uploadDataset = async () => {
    if (!uploadedFile) return
    setUploadStatus('Validating...')
    setUploadError('')
    setShowDisclaimer(false)

    try {
      const { header, data } = await parseFile(uploadedFile)
      setParsed({ header, data })
      setUploadStatus('Uploading...')
      await api.analytics.uploadDataset({ filename: uploadedFile.name, data, columns: header })
      setUploadStatus('Dataset uploaded successfully!')
      setUploadedFile(null)
      loadUploads()
      setTimeout(() => setUploadStatus(''), 5000)
    } catch (e) {
      setUploadError(e.message || 'Upload failed')
      setUploadStatus('')
    }
  }

  const proceedAnalyze = async () => {
    if (!uploadedFile) return
    setUploadStatus('Preparing analysis dataset...')
    setUploadError('')
    setShowDisclaimer(false)
    try {
      const { header, data } = await parseFile(uploadedFile)
      setParsed({ header, data })
      await api.analytics.setActiveDataset({ filename: uploadedFile.name, data, columns: header })
      setUploadStatus('Active dataset set. Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 600)
    } catch (e) {
      setUploadError(e.message || 'Failed to prepare analysis dataset')
      setUploadStatus('')
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Data</h1>
        <p className="text-sm text-gray-400 mt-1">Upload datasets, set active data for analysis, manage predictions, and export.</p>
      </div>

      {/* Upload Section */}
      <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Upload Dataset</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dark-700 border-dashed rounded-lg cursor-pointer bg-dark-800/50 hover:bg-dark-800 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">CSV files only (MAX. 10MB)</p>
              </div>
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>

          {uploadedFile && (
            <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div className="flex items-center gap-2">
                <FiFileText className="text-primary-400" />
                <span className="text-sm text-gray-200">{uploadedFile.name}</span>
              </div>
              <button onClick={() => { setUploadedFile(null); setShowDisclaimer(false) }} className="text-gray-400 hover:text-red-400"><FiX /></button>
            </div>
          )}

          {uploadStatus && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
              <FiCheckCircle /> {uploadStatus}
            </div>
          )}

          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
              <FiAlertCircle className="mt-0.5 shrink-0" />
              <div>{uploadError}</div>
            </div>
          )}

          {showDisclaimer && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <FiAlertCircle className="text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-400">Required Columns</h3>
                  <p className="text-xs text-gray-400 mt-1">Your CSV must include the following columns for analysis:</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {REQUIRED_FEATURES.map(f => (
                  <div key={f} className="text-xs text-gray-300 bg-dark-800/50 px-2 py-1 rounded">{f}</div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={proceedAnalyze} className="flex-1 rounded-lg bg-primary-700 hover:bg-primary-600 px-4 py-2 text-sm text-white font-semibold">Proceed & Analyze</button>
                <button onClick={uploadDataset} className="flex-1 rounded-lg bg-primary-600 hover:bg-primary-500 px-4 py-2 text-sm text-white font-semibold">Upload Only</button>
                <button onClick={() => { setShowDisclaimer(false); setUploadedFile(null) }} className="rounded-lg border border-dark-700 hover:bg-dark-800 px-4 py-2 text-sm text-gray-200">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Export Section */}
      <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-100 mb-1">Export Data</h2>
        <p className="text-sm text-gray-400 mb-4">Download your dataset and prediction results in CSV or JSON format.</p>
        {exportSuccess && <div className="mb-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm">{exportSuccess}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={exportDatasetCSV} disabled={exportLoading.dcsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2.5 text-white font-semibold">
            <FiDownload /> {exportLoading.dcsv ? 'Exporting...' : 'Dataset CSV'}
          </button>
          <button onClick={exportDatasetJSON} disabled={exportLoading.djson} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50 px-4 py-2.5 text-gray-200">
            <FiFileText /> {exportLoading.djson ? 'Exporting...' : 'Dataset JSON'}
          </button>
          <button onClick={exportPredsCSV} disabled={exportLoading.pcsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2.5 text-white font-semibold">
            <FiDownload /> {exportLoading.pcsv ? 'Exporting...' : 'Predictions CSV'}
          </button>
          <button onClick={exportPredsJSON} disabled={exportLoading.pjson} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 disabled:opacity-50 px-4 py-2.5 text-gray-200">
            <FiFileText /> {exportLoading.pjson ? 'Exporting...' : 'Predictions JSON'}
          </button>
        </div>
      </section>

      {/* Recent Uploads (CRUD) */}
      <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-gray-100">Recent Uploads</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-64 max-w-full">
              <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={uploadsSearch}
                onChange={(e)=>{ setUploadsPage(1); setUploadsSearch(e.target.value) }}
                placeholder="Search filename..."
                className="w-full rounded-md bg-dark-800 border border-dark-700 pl-8 pr-2 py-2 text-sm text-gray-200"
              />
            </div>
            <button onClick={loadUploads} className="text-xs px-3 py-1.5 rounded-full border border-dark-700 text-gray-300 hover:bg-dark-800">Refresh</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-dark-800">
          <table className="min-w-full divide-y divide-dark-800">
            <thead className="bg-dark-900">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rows</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Columns</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uploaded</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-dark-900 divide-y divide-dark-800">
              {uploadsLoading && (
                <tr><td colSpan={5} className="px-3 py-4 text-sm text-gray-400">Loading...</td></tr>
              )}
              {!uploadsLoading && uploads.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-4 text-sm text-gray-400">No uploads yet.</td></tr>
              )}
              {!uploadsLoading && uploads.map(u => (
                <tr key={u.id} className="hover:bg-dark-800/50">
                  <td className="px-3 py-2 text-sm text-gray-200 flex items-center gap-2">
                    <span className="p-1.5 rounded bg-primary-600/15 border border-primary-700/30"><FiFileText className="h-4 w-4 text-primary-400"/></span>
                    <span className="truncate max-w-[32ch] md:max-w-[42ch]" title={u.filename}>{u.filename}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-300">{u.row_count?.toLocaleString?.() || u.row_count || 0}</td>
                  <td className="px-3 py-2 text-sm text-gray-300">{u.columns?.length || 0}</td>
                  <td className="px-3 py-2 text-sm text-gray-400">{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</td>
                  <td className="px-3 py-2 text-right text-sm">
                    <div className="inline-flex gap-2">
                      <button onClick={()=> navigate(`/dashboard/exports/uploads/${u.id}`)} className="px-2 py-1 rounded border border-dark-700 hover:bg-dark-800 text-gray-200 inline-flex items-center gap-1"><FiEye/> View</button>
                      <button onClick={async()=>{ await api.analytics.uploadAnalyze(u.id); window.dispatchEvent(new Event('dataset:updated')); navigate('/dashboard') }} className="px-2 py-1 rounded bg-primary-600 hover:bg-primary-500 text-white inline-flex items-center gap-1"><FiPlay/> Analyze</button>
                      <button onClick={async()=>{ const d = await api.analytics.uploadDownload(u.id, 'csv'); download(d.content || '', d.filename || 'dataset.csv', 'text/csv') }} className="px-2 py-1 rounded border border-dark-700 hover:bg-dark-800 text-gray-200 inline-flex items-center gap-1"><FiDownload/> CSV</button>
                      <button onClick={()=> setDeleteItem({ id: u.id, filename: u.filename })} className="px-2 py-1 rounded bg-red-600/70 hover:bg-red-600 text-white inline-flex items-center gap-1"><FiTrash2/> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <button disabled={uploadsPage<=1} onClick={()=>setUploadsPage(p=>p-1)} className="px-3 py-1.5 border border-dark-700 rounded disabled:opacity-40">Prev</button>
          <span>Page {uploadsPage} / {Math.max(1, Math.ceil(uploadsTotal/uploadsLimit))}</span>
          <button disabled={uploadsPage>=Math.max(1, Math.ceil(uploadsTotal/uploadsLimit))} onClick={()=>setUploadsPage(p=>p+1)} className="px-3 py-1.5 border border-dark-700 rounded disabled:opacity-40">Next</button>
        </div>

        {preview && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="w-full max-w-5xl max-h-[80vh] overflow-auto rounded-xl border border-dark-700 bg-dark-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{preview.upload?.filename}</h3>
                  <p className="text-xs text-gray-400">{preview.upload?.row_count?.toLocaleString?.() || preview.upload?.row_count || 0} rows · {preview.columns?.length || 0} columns</p>
                </div>
                <button onClick={()=>setPreview(null)} className="p-1.5 rounded border border-dark-700 hover:bg-dark-800 text-gray-300"><FiX/></button>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      {preview.columns?.map((c)=> (
                        <th key={c} className="px-2 py-1 text-left text-gray-400 bg-dark-800 sticky top-0">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(preview.sample || []).map((row, idx)=> (
                      <tr key={idx} className="odd:bg-dark-900 even:bg-dark-900/60">
                        {preview.columns?.map((c)=> (
                          <td key={c} className="px-2 py-1 text-gray-200 whitespace-nowrap">{String(row?.[c] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {deleteItem && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="w-full max-w-md rounded-xl border border-dark-700 bg-dark-900 p-5">
              <h3 className="text-lg font-semibold text-gray-100">Delete upload?</h3>
              <p className="mt-2 text-sm text-gray-400">This will remove the upload metadata and its stored dataset. This action cannot be undone.</p>
              <div className="mt-3 p-3 rounded-lg bg-dark-800 border border-dark-700 text-xs text-gray-300">{deleteItem.filename}</div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button onClick={()=> setDeleteItem(null)} className="rounded-md border border-dark-700 px-4 py-2 text-sm text-gray-200 hover:bg-dark-800">Cancel</button>
                <button onClick={async()=>{
                  try {
                    await api.analytics.deleteUpload(deleteItem.id)
                    // If this upload was the active dataset, clear it and notify listeners
                    try {
                      const meta = await api.analytics.getActiveDataset()
                      const active = meta?.active && meta?.dataset
                      if (active && (active.upload_id === deleteItem.id || active.filename === deleteItem.filename)) {
                        await api.analytics.clearActiveDataset()
                        window.dispatchEvent(new Event('dataset:updated'))
                      }
                    } catch {}
                  } finally {
                    setDeleteItem(null)
                    loadUploads()
                  }
                }} className="rounded-md bg-red-600 hover:bg-red-500 px-4 py-2 text-sm text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
