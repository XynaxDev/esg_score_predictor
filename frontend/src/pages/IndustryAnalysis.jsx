import { useState, useEffect, useMemo } from 'react'
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
  PieChart,
  Pie,
  Cell,
  Sector,
  Label,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

const IndustryAnalysis = () => {
  const { filters } = useFilterStore()
  const [industryData, setIndustryData] = useState([])
  const [activePieIndex, setActivePieIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  // Total for donut center label
  const totalCompanies = useMemo(() => (
    industryData.reduce((acc, d) => acc + (d.CompanyCount || 0), 0)
  ), [industryData])

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await api.getIndustryAnalysis(filters)
      setIndustryData(data)
    } catch (error) {
      console.error('Failed to load industry data:', error)
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

  if (!industryData || industryData.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100">No data available</h2>
          <p className="mt-2 text-gray-400">Start your first analysis by uploading a CSV dataset. Once analyzed, this section will display industry insights.</p>
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
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Industry Analysis</h1>
        <p className="text-gray-400">
          Compare ESG performance and metrics across different industries
        </p>
      </div>


      {/* ESG Scores by Industry */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">ESG Scores by Industry</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={industryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="envGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.6}/>
              </linearGradient>
              <linearGradient id="socialGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6}/>
              </linearGradient>
              <linearGradient id="govGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="Industry" 
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              tick={{ fill: '#9ca3af' }}
              label={{ value: 'ESG Score', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              content={<CustomTooltip 
                valueFormatter={(value) => `${value.toFixed(2)}`}
              />}
              cursor={{ fill: '#374151', opacity: 0.1 }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="ESG_Environmental" fill="url(#envGradient)" name="Environmental" radius={[8, 8, 0, 0]} animationDuration={800} />
            <Bar dataKey="ESG_Social" fill="url(#socialGradient)" name="Social" radius={[8, 8, 0, 0]} animationDuration={800} />
            <Bar dataKey="ESG_Governance" fill="url(#govGradient)" name="Governance" radius={[8, 8, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Company Distribution</h3>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={industryData}
                dataKey="CompanyCount"
                nameKey="Industry"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                labelLine={false}
                isAnimationActive
                activeIndex={activePieIndex}
                activeShape={(props) => (
                  <Sector {...props} outerRadius={props.outerRadius + 6} />
                )}
                onMouseEnter={(_, idx) => setActivePieIndex(idx)}
                onMouseLeave={() => setActivePieIndex(null)}
              >
                {industryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#111827" strokeWidth={1} />
                ))}
                <Label value={`${totalCompanies.toLocaleString()} companies`} position="center" fill="#9ca3af" fontSize={12} />
              </Pie>
              <Tooltip 
                content={(props) => (
                  <CustomTooltip 
                    {...props}
                    label={props?.payload?.[0]?.payload?.Industry}
                    valueFormatter={(v, entry) => {
                      if (entry?.name === 'CompanyCount' || entry?.dataKey === 'CompanyCount') return Number(v).toLocaleString()
                      return Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })
                    }}
                    getColor={(entry) => entry?.payload?.fill || entry?.color}
                  />
                )}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                iconType="circle"
                wrapperStyle={{ color: '#9ca3af', paddingTop: 8, marginTop: 8 }}
                formatter={(value, entry) => `${value}: ${entry?.payload?.CompanyCount?.toLocaleString?.() ?? ''}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Average Revenue by Industry</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryData} layout="vertical" margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" tick={{ fill: '#9ca3af' }} tickFormatter={(v) => `$${Number(v).toFixed(0)}M`} label={{ value: 'Revenue (M)', position: 'bottom', offset: 20, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="Industry" tick={{ fill: '#9ca3af' }} width={100} />
              <Tooltip 
                content={<CustomTooltip valueFormatter={(value) => `$${value.toFixed(1)}M`} />}
                cursor={{ fill: '#374151', opacity: 0.1 }}
              />
              <Bar dataKey="Revenue" fill="#3b82f6" radius={[0, 8, 8, 0]} animationDuration={800} />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ESG vs Carbon Emissions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">
          ESG Score vs Carbon Emissions by Industry
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="ESG_Overall"
              name="ESG Score"
              tick={{ fill: '#9ca3af' }}
              label={{ value: 'ESG Score', position: 'bottom', offset: 20, fill: '#9ca3af' }}
            />
            <YAxis
              type="number"
              dataKey="CarbonEmissions"
              name="Carbon Emissions"
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(v) => v >= 1000 ? `${Math.round(v/1000)}K` : v}
              label={{ value: 'Carbon Emissions', angle: -90, position: 'left', offset: 20, fill: '#9ca3af' }}
            />
            <ZAxis type="number" dataKey="Revenue" range={[120, 600]} name="Revenue" />
            <Tooltip
              content={(props) => (
                <CustomTooltip 
                  {...props}
                  label={props?.payload?.[0]?.payload?.Industry}
                  valueFormatter={(v, entry) => {
                    const key = entry?.name || entry?.dataKey
                    if (key?.toLowerCase().includes('carbon')) return `${(Number(v)/1000).toFixed(1)}K`
                    if (key?.toLowerCase().includes('revenue')) return `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
                    return Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })
                  }}
                />
              )}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} align="right" verticalAlign="top" height={36} />
            <Scatter name="Industries" data={industryData} fill="#3b82f6" fillOpacity={0.9} stroke="#111827" strokeWidth={1} animationDuration={800}>
              {industryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Industry Details Table */}
      <DataTable
        title="Industry Performance Details"
        data={industryData}
        columns={[
          { header: 'Industry', key: 'Industry', accessor: (row) => row.Industry, sortable: true },
          { header: 'Companies', key: 'CompanyCount', accessor: (row) => row.CompanyCount, sortable: true },
          { header: 'ESG Score', key: 'ESG_Overall', accessor: (row) => row.ESG_Overall?.toFixed(1), sortable: true },
          { header: 'Environmental', key: 'ESG_Environmental', accessor: (row) => row.ESG_Environmental?.toFixed(1), sortable: true },
          { header: 'Social', key: 'ESG_Social', accessor: (row) => row.ESG_Social?.toFixed(1), sortable: true },
          { header: 'Governance', key: 'ESG_Governance', accessor: (row) => row.ESG_Governance?.toFixed(1), sortable: true },
          { header: 'Avg Revenue (M)', key: 'Revenue', accessor: (row) => `$${row.Revenue?.toFixed(1)}`, sortable: true },
          { header: 'Carbon (K tons)', key: 'CarbonEmissions', accessor: (row) => `${(row.CarbonEmissions / 1000).toFixed(1)}K`, sortable: true },
        ]}
        exportable={true}
        showInsights={true}
      />
    </div>
  )
}

export default IndustryAnalysis
