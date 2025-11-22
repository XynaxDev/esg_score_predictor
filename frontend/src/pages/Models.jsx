import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Loader2, LineChart, Sparkles, Upload, FileUp, X } from 'lucide-react'

export default function Models() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [activeTab, setActiveTab] = useState('single')
  const [modelStatus, setModelStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  
  const [datasetColumns, setDatasetColumns] = useState([])
  const [predInputs, setPredInputs] = useState({})
  const [predicting, setPredicting] = useState(false)
  const [predResult, setPredResult] = useState(null)
  const [predError, setPredError] = useState('')

  const [batchFile, setBatchFile] = useState(null)
  const [batchData, setBatchData] = useState([])
  const [batchPredicting, setBatchPredicting] = useState(false)
  const [batchResult, setBatchResult] = useState(null)
  const [batchError, setBatchError] = useState('')

  useEffect(() => {
    checkModelStatus()
    loadDatasetColumns()
  }, [])

  const checkModelStatus = async () => {
    setStatusLoading(true)
    try {
      const status = await api.analytics.getModelStatus()
      setModelStatus(status)
    } catch (e) {
      setModelStatus({ configured: false, message: 'Failed to check model status' })
    } finally {
      setStatusLoading(false)
    }
  }

  const loadDatasetColumns = async () => {
    try {
      const features = ['Revenue', 'ProfitMargin', 'MarketCap', 'GrowthRate', 'ESG_Environmental', 'ESG_Social', 'ESG_Governance', 'CarbonEmissions', 'WaterUsage', 'EnergyConsumption']
      setDatasetColumns(features)
      const initial = {}
      features.forEach(f => initial[f] = '')
      setPredInputs(initial)
    } catch (e) {
      console.error('Failed to load dataset columns:', e)
    }
  }

  const predict = async () => {
    if (!modelStatus?.configured) {
      setPredError('AI model is not configured. Please contact support to enable predictions.')
      return
    }

    setPredicting(true)
    setPredResult(null)
    setPredError('')
    
    const inputs = {}
    Object.entries(predInputs).forEach(([k, v]) => {
      if (v !== '') inputs[k] = parseFloat(v) || 0
    })
    
    if (Object.keys(inputs).length === 0) {
      setPredError('Please enter at least one feature value')
      setPredicting(false)
      return
    }
    
    try {
      const res = await api.analytics.makePrediction(inputs)
      setPredResult(res)
    } catch (e) {
      setPredError(e?.response?.data?.error || 'Prediction failed')
    } finally {
      setPredicting(false)
    }
  }

  const handleInputChange = (feature, value) => {
    setPredInputs(prev => ({ ...prev, [feature]: value }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setBatchFile(file)
    setBatchError('')
    
    // Simple CSV parsing
    if (file.name.endsWith('.csv')) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const text = evt.target.result
          const lines = text.split('\n').filter(line => line.trim())
          const headers = lines[0].split(',').map(h => h.trim())
          const data = []
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',')
            const row = {}
            headers.forEach((header, idx) => {
              const val = values[idx]?.trim()
              row[header] = isNaN(val) ? val : parseFloat(val)
            })
            data.push(row)
          }
          
          setBatchData(data)
        } catch (err) {
          setBatchError('Failed to parse CSV file')
          setBatchFile(null)
        }
      }
      reader.readAsText(file)
    } else {
      setBatchError('Please upload a CSV file. XLSX support coming soon.')
      setBatchFile(null)
    }
  }

  const predictBatch = async () => {
    if (!modelStatus?.configured) {
      setBatchError('AI model is not configured. Please contact support to enable predictions.')
      return
    }

    if (!batchData || batchData.length === 0) {
      setBatchError('No data to predict')
      return
    }

    setBatchPredicting(true)
    setBatchResult(null)
    setBatchError('')

    try {
      const res = await api.analytics.predictBatch(batchData)
      setBatchResult(res)
    } catch (e) {
      setBatchError(e?.response?.data?.error || 'Batch prediction failed')
    } finally {
      setBatchPredicting(false)
    }
  }

  const clearBatchFile = () => {
    setBatchFile(null)
    setBatchData([])
    setBatchResult(null)
    setBatchError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (statusLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Make Predictions</h1>
          <p className="text-sm text-gray-400 mt-1">Use AI to predict ESG scores with {modelStatus?.configured ? modelStatus.model_name : 'your model'}</p>
        </div>
        <button onClick={() => navigate('/dashboard/predictions-analytics')} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 px-4 py-2 text-white font-semibold">
          <LineChart className="h-4 w-4" />
          View Analytics
        </button>
      </div>

      {!modelStatus?.configured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-300">Model Not Available</h3>
              <p className="text-sm text-amber-200 mt-1">The AI prediction model is currently not configured. You can explore the interface, but predictions are disabled. Please contact support to enable this feature.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-dark-700">
        <button onClick={() => setActiveTab('single')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'single' ? 'border-b-2 border-primary-500 text-primary-400' : 'text-gray-400 hover:text-gray-200'}`}>
          <Sparkles className="inline h-4 w-4 mr-2" />
          Single
        </button>
        <button onClick={() => setActiveTab('batch')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'batch' ? 'border-b-2 border-primary-500 text-primary-400' : 'text-gray-400 hover:text-gray-200'}`}>
          <FileUp className="inline h-4 w-4 mr-2" />
          Batch
        </button>
      </div>

      {activeTab === 'single' && (
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Single Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasetColumns.map(col => (
              <div key={col}>
                <label className="block text-sm text-gray-300 mb-1">{col}</label>
                <input type="number" step="any" value={predInputs[col] || ''} onChange={(e) => handleInputChange(col, e.target.value)} placeholder="0.0" className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={predict} disabled={predicting} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-6 py-2.5 text-white font-semibold">
              {predicting ? <><Loader2 className="h-4 w-4 animate-spin" />Predicting...</> : <><TrendingUp className="h-4 w-4" />Predict</>}
            </button>
            {predResult && <span className="text-sm text-gray-400">Saved (ID: {predResult.saved_id?.slice(0,8)}...)</span>}
          </div>
          {predError && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm"><AlertCircle className="inline h-4 w-4 mr-2" />{predError}</div>}
          {predResult && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 inline mr-2" />
              <strong>Predicted:</strong> {predResult.prediction !== null ? predResult.prediction : 'N/A'}
            </div>
          )}
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Batch Prediction</h2>
          <p className="text-sm text-gray-400 mb-4">Upload CSV or XLSX file</p>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="batch-upload" />
          <label htmlFor="batch-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-dark-700 rounded-lg cursor-pointer bg-dark-800/50 hover:bg-dark-800">
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Click to upload CSV file</p>
              <p className="text-xs text-gray-500 mt-1">XLSX support coming soon</p>
            </div>
          </label>
          {batchFile && (
            <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-dark-700">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-primary-400" />
                <div>
                  <p className="text-sm text-gray-200">{batchFile.name}</p>
                  <p className="text-xs text-gray-400">{batchData.length} rows</p>
                </div>
              </div>
              <button onClick={clearBatchFile} className="text-gray-400 hover:text-gray-200"><X className="h-5 w-5" /></button>
            </div>
          )}
          <button onClick={predictBatch} disabled={!batchFile || batchPredicting} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-6 py-2.5 text-white font-semibold">
            {batchPredicting ? <><Loader2 className="h-4 w-4 animate-spin" />Processing...</> : <><TrendingUp className="h-4 w-4" />Predict Batch</>}
          </button>
          {batchError && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm"><AlertCircle className="inline h-4 w-4 mr-2" />{batchError}</div>}
          {batchResult && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 inline mr-2" />
              <strong>{batchResult.message}</strong>
              <div className="mt-2 text-xs text-emerald-200">
                Success: {batchResult.results?.length || 0} · Failed: {batchResult.errors?.length || 0}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
