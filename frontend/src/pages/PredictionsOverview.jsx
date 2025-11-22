import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Brain, Activity, Clock, Loader2, AlertCircle } from 'lucide-react'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export default function PredictionsOverview() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.analytics.getPredictionsAnalytics()
      setAnalytics(data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400 mx-auto mb-3" />
          <p className="text-gray-400">Loading predictions analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300 max-w-md">
          <AlertCircle className="h-6 w-6 mx-auto mb-3" />
          <p className="text-center">{error}</p>
        </div>
      </div>
    )
  }

  if (!analytics || analytics.total_predictions === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-100">No Predictions Yet</h2>
          <p className="mt-2 text-gray-400">Start making predictions to see your analytics, charts, and model performance metrics here.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => window.location.href = '/dashboard/predictions'} className="rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-2.5">
              Make Predictions
            </button>
            <button onClick={() => window.location.href = '/dashboard/models'} className="rounded-lg border border-dark-700 hover:bg-dark-800 text-gray-200 font-semibold px-6 py-2.5">
              View Model Info
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Predictions Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Analytics and insights from your AI model predictions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/30">
              <TrendingUp className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Predictions</div>
              <div className="text-2xl font-bold text-gray-100">{analytics.total_predictions}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Models Used</div>
              <div className="text-2xl font-bold text-gray-100">{analytics.models_used?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Latest Activity</div>
              <div className="text-sm font-semibold text-gray-100">
                {analytics.recent_predictions?.[0]?.created_at
                  ? new Date(analytics.recent_predictions[0].created_at).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions Over Time */}
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-400" />
            Predictions Over Time
          </h3>
          {analytics.predictions_over_time && analytics.predictions_over_time.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.predictions_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No time series data available</p>
          )}
        </div>

        {/* Models Usage */}
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Models Usage
          </h3>
          {analytics.models_used && analytics.models_used.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.models_used}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ model, percent }) => `${model}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.models_used.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No model usage data available</p>
          )}
        </div>
      </div>

      {/* Output Distribution */}
      {analytics.output_distribution && analytics.output_distribution.length > 0 && (
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            Output Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.output_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Predictions Table */}
      <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Predictions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-800">
            <thead className="bg-dark-900">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Model</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Output</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-dark-900 divide-y divide-dark-800">
              {analytics.recent_predictions && analytics.recent_predictions.length > 0 ? (
                analytics.recent_predictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-dark-800/50">
                    <td className="px-3 py-2 text-sm text-gray-300 font-mono">{pred.id?.slice(0, 8)}...</td>
                    <td className="px-3 py-2 text-sm text-gray-200">{pred.model || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-200 font-semibold">
                      {pred.output !== null && pred.output !== undefined ? pred.output : 'N/A'}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-400">
                      {pred.created_at ? new Date(pred.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-sm text-gray-400 text-center">
                    No recent predictions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
