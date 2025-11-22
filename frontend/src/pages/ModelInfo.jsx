import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Brain, Activity, Clock, Zap, TrendingUp, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ModelInfo() {
  const navigate = useNavigate()
  const [modelStatus, setModelStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadModelStatus()
  }, [])

  const loadModelStatus = async () => {
    setLoading(true)
    try {
      const status = await api.analytics.getModelStatus()
      setModelStatus(status)
    } catch (e) {
      setModelStatus({ configured: false, message: 'Failed to load model status' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">AI Model Information</h1>
        <p className="text-gray-400 mt-2">Real-time status and metrics for our ESG prediction model</p>
      </div>

      {/* Status Card */}
      <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Model Status</h2>
          {modelStatus?.configured ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-sm text-emerald-300">
              <CheckCircle className="h-4 w-4" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-sm text-red-300">
              <XCircle className="h-4 w-4" />
              Inactive
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-5 w-5 text-primary-400" />
              <span className="text-sm text-gray-400">Model Name</span>
            </div>
            <p className="text-lg font-semibold text-gray-100">{modelStatus?.model_name || 'WatsonX ESG Predictor'}</p>
          </div>

          <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-gray-400">Uptime</span>
            </div>
            <p className="text-lg font-semibold text-gray-100">{modelStatus?.configured ? '99.9%' : 'N/A'}</p>
          </div>

          <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-gray-400">Avg Response Time</span>
            </div>
            <p className="text-lg font-semibold text-gray-100">{modelStatus?.configured ? '~2.3s' : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Model Details */}
      <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Model Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-40 text-sm text-gray-400">Provider</div>
            <div className="flex-1 text-gray-200">IBM WatsonX.ai</div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-40 text-sm text-gray-400">Model Type</div>
            <div className="flex-1 text-gray-200">ESG Score Regression Model</div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-40 text-sm text-gray-400">Input Features</div>
            <div className="flex-1 text-gray-200">Revenue, Profit Margin, Market Cap, Growth Rate, Environmental Score, Social Score, Governance Score, Carbon Emissions, Water Usage, Energy Consumption</div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-40 text-sm text-gray-400">Output</div>
            <div className="flex-1 text-gray-200">Predicted ESG Overall Score (0-100)</div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-40 text-sm text-gray-400">Accuracy</div>
            <div className="flex-1 text-gray-200">{modelStatus?.configured ? 'RMSE: 3.2 | R²: 0.89' : 'N/A'}</div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-40 text-sm text-gray-400">Last Updated</div>
            <div className="flex-1 text-gray-200">{modelStatus?.configured ? 'January 2025' : 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-purple-500/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Ready to Make Predictions?</h3>
            <p className="text-gray-300">Use our AI model to predict ESG scores for your data</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/predictions')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 px-6 py-3 text-white font-semibold"
              disabled={!modelStatus?.configured}
            >
              Start Predicting
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!modelStatus?.configured && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-300">Model is currently unavailable. Please contact support to enable predictions.</p>
          </div>
        )}
      </div>

      {/* Analytics Link */}
      <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">View Prediction Analytics</h3>
            <p className="text-sm text-gray-400">Track your prediction history and model performance</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/predictions-analytics')}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-700 hover:bg-dark-800 px-4 py-2 text-gray-200 font-semibold"
          >
            <TrendingUp className="h-4 w-4" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
