import { useState, useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import { api } from '../utils/api'
import CustomTooltip from '../components/CustomTooltip'
import DataTable from '../components/DataTable'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts'

const TrendsOverTime = () => {
  const { filters } = useFilterStore()
  const [trendsData, setTrendsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await api.getTrends(filters)
      setTrendsData(data)
    } catch (error) {
      console.error('Failed to load trends data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!trendsData || trendsData.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100">No data available</h2>
          <p className="mt-2 text-gray-400">Upload a CSV dataset and click Analyze to explore time-based ESG and financial trends.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a href="/dashboard/exports" className="rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-2">Upload dataset</a>
            <a href="/contact" className="rounded-lg border border-dark-700 px-5 py-2 text-gray-200 hover:bg-dark-800">Contact support</a>
          </div>
          <p className="mt-3 text-xs text-gray-500">Accepted format: CSV. Required columns include CompanyName, Industry, Region, Year, Revenue, and ESG scores.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Trends Over Time</h1>
        <p className="text-gray-400">
          Track ESG performance and financial metrics evolution over the years
        </p>
      </div>


      {/* ESG Trends */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">ESG Score Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendsData} margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="Year" tick={{ fill: '#9ca3af' }} label={{ value: 'Year', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value.toFixed(2)}`} />} />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Line
              type="monotone"
              dataKey="ESG_Overall"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Overall ESG"
            />
            <Line
              type="monotone"
              dataKey="ESG_Environmental"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Environmental"
            />
            <Line
              type="monotone"
              dataKey="ESG_Social"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 3 }}
              name="Social"
            />
            <Line
              type="monotone"
              dataKey="ESG_Governance"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 3 }}
              name="Governance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue and Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendsData} margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="Year" tick={{ fill: '#9ca3af' }} label={{ value: 'Year', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'Revenue (M)', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip valueFormatter={(value) => `$${value.toFixed(1)}M` } />} cursor={{ fill: '#374151', opacity: 0.1 }} />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#3b82f6"
                fill="url(#revGradient)"
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Growth Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData} margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="Year" tick={{ fill: '#9ca3af' }} label={{ value: 'Year', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'Growth Rate (%)', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value.toFixed(1)}%` } />} cursor={{ fill: '#374151', opacity: 0.1 }} />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Line
                type="monotone"
                dataKey="GrowthRate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Carbon Emissions Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Carbon Emissions Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={trendsData} margin={{ top: 10, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="Year" tick={{ fill: '#9ca3af' }} label={{ value: 'Year', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#9ca3af' }}
              label={{ value: 'Carbon Emissions', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#9ca3af' }}
              label={{ value: 'ESG Score', angle: 90, position: 'insideRight', fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value.toFixed(2)}`} />} />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Bar
              yAxisId="left"
              dataKey="CarbonEmissions"
              fill="#ef4444"
              name="Carbon Emissions"
              radius={[8, 8, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ESG_Environmental"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              name="Environmental Score"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Year-over-Year Analysis */}
      <DataTable
        title="Year-over-Year Performance"
        data={trendsData}
        columns={[
          { header: 'Year', key: 'Year', accessor: (row) => row.Year, sortable: true },
          { header: 'ESG Score', key: 'ESG_Overall', accessor: (row) => row.ESG_Overall?.toFixed(1), sortable: true },
          { header: 'Environmental', key: 'ESG_Environmental', accessor: (row) => row.ESG_Environmental?.toFixed(1), sortable: true },
          { header: 'Social', key: 'ESG_Social', accessor: (row) => row.ESG_Social?.toFixed(1), sortable: true },
          { header: 'Governance', key: 'ESG_Governance', accessor: (row) => row.ESG_Governance?.toFixed(1), sortable: true },
          { header: 'Revenue (M)', key: 'Revenue', accessor: (row) => `$${row.Revenue?.toFixed(1)}`, sortable: true },
          { header: 'Growth Rate (%)', key: 'GrowthRate', accessor: (row) => `${row.GrowthRate?.toFixed(1)}%`, sortable: true },
        ]}
        exportable={true}
        showInsights={true}
      />
    </div>
  )
}

export default TrendsOverTime
