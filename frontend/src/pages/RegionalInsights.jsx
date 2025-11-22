import { useState, useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import { api } from '../utils/api'
import CustomTooltip from '../components/CustomTooltip'
import DataTable from '../components/DataTable'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

const RegionalInsights = () => {
  const { filters } = useFilterStore()
  const [regionalData, setRegionalData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await api.getRegionalInsights(filters)
      setRegionalData(data)
    } catch (error) {
      console.error('Failed to load regional data:', error)
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

  if (!regionalData || regionalData.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100">No data available</h2>
          <p className="mt-2 text-gray-400">Upload a CSV dataset and click Analyze to see regional insights across ESG metrics.</p>
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
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Regional Insights</h1>
        <p className="text-gray-400">
          Analyze ESG performance and trends across different regions
        </p>
      </div>

      {/* Regional ESG Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">ESG Scores by Region</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={regionalData} margin={{ top: 10, right: 20, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="Region" tick={{ fill: '#9ca3af' }} label={{ value: 'Region', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'ESG Score', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }} />
            <Tooltip 
              content={(props) => (
                <CustomTooltip 
                  {...props}
                  label={props?.payload?.[0]?.payload?.Region}
                  valueFormatter={(value) => `${Number(value).toFixed(2)}`}
                />
              )}
              cursor={{ fill: '#374151', opacity: 0.1 }} 
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} align="right" verticalAlign="top" height={36} />
            <Bar dataKey="ESG_Overall" fill="#3b82f6" name="Overall ESG" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* ESG Components by Region */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">ESG Components by Region</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={regionalData} margin={{ top: 10, right: 20, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="Region" tick={{ fill: '#9ca3af' }} label={{ value: 'Region', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'Score', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value.toFixed(2)}`} />} cursor={{ fill: '#374151', opacity: 0.1 }} />
            <Legend wrapperStyle={{ color: '#9ca3af' }} align="right" verticalAlign="top" height={36} position="top-right" />
            <Bar dataKey="ESG_Environmental" fill="#10b981" name="Environmental" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ESG_Social" fill="#f59e0b" name="Social" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ESG_Governance" fill="#8b5cf6" name="Governance" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Revenue by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={regionalData} margin={{ top: 10, right: 20, bottom: 50, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="Region" tick={{ fill: '#9ca3af' }} label={{ value: 'Region', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'Revenue (M)', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }} />
              <Tooltip 
                content={(props) => (
                  <CustomTooltip 
                    {...props}
                    label={props?.payload?.[0]?.payload?.Region}
                    valueFormatter={(v) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`}
                  />
                )}
                cursor={{ fill: '#374151', opacity: 0.1 }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} align="right" verticalAlign="top" height={24} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Carbon Emissions by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData} layout="vertical" margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" tick={{ fill: '#9ca3af' }} label={{ value: 'Carbon Emissions (tons)', position: 'bottom', offset: 10, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="Region" tick={{ fill: '#9ca3af' }} width={120} />
              <Tooltip 
                content={(props) => (
                  <CustomTooltip 
                    {...props}
                    label={props?.payload?.[0]?.payload?.Region}
                    valueFormatter={(v) => `${(Number(v)/1000).toFixed(1)}K tons`}
                  />
                )}
                cursor={{ fill: '#374151', opacity: 0.1 }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="CarbonEmissions" fill="#ef4444" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Radar Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">
          Regional ESG Profile Comparison
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={regionalData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="Region" tick={{ fill: '#9ca3af' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
            <Radar name="ESG Overall" dataKey="ESG_Overall" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
            <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value.toFixed(2)}`} />} cursor={{ fill: '#374151', opacity: 0.1 }} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Details Table */}
      <DataTable
        title="Regional Performance Summary"
        data={regionalData}
        columns={[
          {
            header: 'Region',
            key: 'Region',
            accessor: (row) => row.Region,
            sortable: true
          },
          {
            header: 'Companies',
            key: 'CompanyCount',
            accessor: (row) => row.CompanyCount,
            sortable: true
          },
          {
            header: 'ESG Score',
            key: 'ESG_Overall',
            accessor: (row) => row.ESG_Overall?.toFixed(1),
            sortable: true
          },
          {
            header: 'Environmental',
            key: 'ESG_Environmental',
            accessor: (row) => row.ESG_Environmental?.toFixed(1),
            sortable: true
          },
          {
            header: 'Social',
            key: 'ESG_Social',
            accessor: (row) => row.ESG_Social?.toFixed(1),
            sortable: true
          },
          {
            header: 'Governance',
            key: 'ESG_Governance',
            accessor: (row) => row.ESG_Governance?.toFixed(1),
            sortable: true
          },
          {
            header: 'Avg Revenue (M)',
            key: 'Revenue',
            accessor: (row) => `$${row.Revenue?.toFixed(1)}`,
            sortable: true
          }
        ]}
        exportable={true}
        showInsights={true}
      />
    </div>
  )
}

export default RegionalInsights
