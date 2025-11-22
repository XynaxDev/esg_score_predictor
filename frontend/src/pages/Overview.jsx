import { useState, useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import { api } from '../utils/api'
import MetricCard from '../components/MetricCard'
import DataTable from '../components/DataTable'
import CustomTooltip from '../components/CustomTooltip'
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Users, 
  Shield,
  Zap
} from 'lucide-react'
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
  Cell
} from 'recharts'

const Overview = () => {
  const { filters } = useFilterStore()
  const [metrics, setMetrics] = useState(null)
  const [baselineMetrics, setBaselineMetrics] = useState(null)
  const [topPerformers, setTopPerformers] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('overall')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [filters])

  // Load baseline metrics on mount (no filters)
  useEffect(() => {
    const loadBaseline = async () => {
      try {
        const data = await api.getOverview({})
        setBaselineMetrics(data)
      } catch (error) {
        console.error('Failed to load baseline:', error)
      }
    }
    loadBaseline()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [metricsData, performersData] = await Promise.all([
        api.getOverview(filters),
        api.getTopPerformers({ ...filters, category: selectedCategory, limit: 10 })
      ])
      setMetrics(metricsData)
      setTopPerformers(performersData)
    } catch (error) {
      console.error('Failed to load overview data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (metrics) {
      loadTopPerformers()
    }
  }, [selectedCategory])

  const loadTopPerformers = async () => {
    try {
      const data = await api.getTopPerformers({ ...filters, category: selectedCategory, limit: 10 })
      setTopPerformers(data)
    } catch (error) {
      console.error('Failed to load top performers:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!metrics || Number(metrics.totalCompanies || 0) === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100">No data available</h2>
          <p className="mt-2 text-gray-400">Start your first analysis by uploading a CSV dataset. Once analyzed, your dashboard will light up with insights.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a href="/dashboard/exports" className="rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-2">Upload dataset</a>
            <a href="/contact" className="rounded-lg border border-dark-700 px-5 py-2 text-gray-200 hover:bg-dark-800">Contact support</a>
          </div>
          <p className="mt-3 text-xs text-gray-500">Accepted format: CSV. Required columns include CompanyName, Industry, Region, Year, Revenue, and ESG scores.</p>
        </div>
      </div>
    )
  }

  const radarData = [
    { subject: 'Environmental', value: metrics.avgEnvironmentalScore, fullMark: 100 },
    { subject: 'Social', value: metrics.avgSocialScore, fullMark: 100 },
    { subject: 'Governance', value: metrics.avgGovernanceScore, fullMark: 100 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          ESG & Financial Performance Dashboard
        </h1>
        <p className="text-gray-400">
          Comprehensive analysis of environmental, social, and governance metrics across industries
        </p>
      </div>


      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Companies"
          value={metrics.totalCompanies.toLocaleString()}
          icon={Building2}
          color="primary"
          previousValue={baselineMetrics?.totalCompanies}
        />
        <MetricCard
          title="Avg ESG Score"
          value={metrics.avgESGScore.toFixed(1)}
          icon={Leaf}
          color="green"
          previousValue={baselineMetrics?.avgESGScore}
        />
        <MetricCard
          title="Avg Revenue"
          value={`$${(metrics.avgRevenue / 1000).toFixed(1)}B`}
          icon={DollarSign}
          color="blue"
          previousValue={baselineMetrics?.avgRevenue}
        />
        <MetricCard
          title="Avg Growth Rate"
          value={`${metrics.avgGrowthRate.toFixed(1)}%`}
          icon={TrendingUp}
          color="purple"
          previousValue={baselineMetrics?.avgGrowthRate}
        />
      </div>

      {/* ESG Component Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Environmental Score"
          value={metrics.avgEnvironmentalScore.toFixed(1)}
          icon={Leaf}
          color="green"
          previousValue={baselineMetrics?.avgEnvironmentalScore}
        />
        <MetricCard
          title="Social Score"
          value={metrics.avgSocialScore.toFixed(1)}
          icon={Users}
          color="blue"
          previousValue={baselineMetrics?.avgSocialScore}
        />
        <MetricCard
          title="Governance Score"
          value={metrics.avgGovernanceScore.toFixed(1)}
          icon={Shield}
          color="purple"
          previousValue={baselineMetrics?.avgGovernanceScore}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ESG Components Radar */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">ESG Components Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                stroke="#4b5563"
              />
              <Radar
                name="ESG Score"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e40af' }}
                activeDot={{ r: 6, fill: '#60a5fa', strokeWidth: 2 }}
                animationDuration={800}
              />
              <Tooltip
                content={<CustomTooltip 
                  valueFormatter={(value) => `${value.toFixed(1)}/100`}
                />}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Carbon Emissions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Environmental Impact</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Zap className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Carbon Emissions</p>
                  <p className="text-xl font-bold text-gray-100">
                    {(metrics.totalCarbonEmissions / 1000000).toFixed(2)}M tons
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-dark-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Average Environmental Score</p>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.avgEnvironmentalScore}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-400 mt-1">
                {metrics.avgEnvironmentalScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-100">ESG Leadership Board</h3>
          {/* Mobile: dropdown */}
          <div className="md:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 text-gray-200 text-sm rounded-md px-3 py-2"
            >
              <option value="overall">Overall</option>
              <option value="environmental">Environmental</option>
              <option value="social">Social</option>
              <option value="governance">Governance</option>
            </select>
          </div>
          {/* Desktop: button group */}
          <div className="hidden md:flex gap-2">
            {['overall', 'environmental', 'social', 'governance'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topPerformers} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="CompanyName"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              label={{ value: 'ESG Score', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              content={<CustomTooltip 
                valueFormatter={(value) => `${value.toFixed(2)}`}
                labelFormatter={(label) => `Company: ${label}`}
              />}
              cursor={{ fill: '#374151', opacity: 0.1 }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              dataKey={
                selectedCategory === 'overall' ? 'ESG_Overall' :
                selectedCategory === 'environmental' ? 'ESG_Environmental' :
                selectedCategory === 'social' ? 'ESG_Social' :
                'ESG_Governance'
              }
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              name={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Score`}
            >
              {topPerformers.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <DataTable
        title="Top ESG Performers - Detailed View"
        data={topPerformers}
        columns={[
          {
            header: 'Company',
            key: 'CompanyName',
            accessor: (row) => row.CompanyName,
            sortable: true
          },
          {
            header: 'Industry',
            key: 'Industry',
            accessor: (row) => row.Industry,
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
      />
    </div>
  )
}

export default Overview
