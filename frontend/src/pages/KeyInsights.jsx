import { useState, useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import { api } from '../utils/api'
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

const KeyInsights = () => {
  const { filters } = useFilterStore()
  const [overview, setOverview] = useState(null)
  const [industryData, setIndustryData] = useState([])
  const [trendsData, setTrendsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [overviewData, industry, trends] = await Promise.all([
        api.getOverview(filters),
        api.getIndustryAnalysis(filters),
        api.getTrends(filters)
      ])
      setOverview(overviewData)
      setIndustryData(industry)
      setTrendsData(trends)
    } catch (error) {
      console.error('Failed to load insights data:', error)
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

  if (!overview || Number(overview.totalCompanies || 0) === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100">No data available</h2>
          <p className="mt-2 text-gray-400">Upload a CSV dataset and click Analyze to discover insight summaries across ESG metrics.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a href="/dashboard/exports" className="rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-2">Upload dataset</a>
            <a href="/contact" className="rounded-lg border border-dark-700 px-5 py-2 text-gray-200 hover:bg-dark-800">Contact support</a>
          </div>
          <p className="mt-3 text-xs text-gray-500">Accepted format: CSV. Required columns include CompanyName, Industry, Region, Year, Revenue, and ESG scores.</p>
        </div>
      </div>
    )
  }

  // Calculate insights
  const bestIndustry = industryData.reduce((prev, current) => 
    (prev.ESG_Overall > current.ESG_Overall) ? prev : current
  , {})

  const worstIndustry = industryData.reduce((prev, current) => 
    (prev.ESG_Overall < current.ESG_Overall) ? prev : current
  , {})

  const esgTrend = trendsData.length > 1 
    ? trendsData[trendsData.length - 1].ESG_Overall - trendsData[0].ESG_Overall
    : 0

  const carbonEmissionTrend = trendsData.length > 1
    ? ((trendsData[trendsData.length - 1].CarbonEmissions - trendsData[0].CarbonEmissions) / trendsData[0].CarbonEmissions) * 100
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Key Insights</h1>
        <p className="text-gray-400">
          Discover important patterns and trends in ESG performance
        </p>
      </div>

      {/* Overall Performance Insights */}
      <div className="card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary-500/10 rounded-lg">
            <Lightbulb className="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Overall ESG Performance</h3>
            <p className="text-gray-400">Analysis of current ESG metrics across all companies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
            <div className="flex items-center gap-2 mb-3">
              {overview.avgESGScore >= 60 ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              )}
              <h4 className="text-lg font-semibold text-gray-200">ESG Score Analysis</h4>
            </div>
            <p className="text-gray-300 mb-3">
              The average ESG score across all companies is <strong className="text-primary-400">{overview.avgESGScore.toFixed(1)}</strong>.
              {overview.avgESGScore >= 60 
                ? ' This indicates a strong commitment to ESG principles across the portfolio.'
                : ' There is significant room for improvement in ESG practices.'
              }
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Environmental:</span>
                <span className="text-gray-200 font-medium">{overview.avgEnvironmentalScore.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Social:</span>
                <span className="text-gray-200 font-medium">{overview.avgSocialScore.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Governance:</span>
                <span className="text-gray-200 font-medium">{overview.avgGovernanceScore.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
            <div className="flex items-center gap-2 mb-3">
              {esgTrend >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
              <h4 className="text-lg font-semibold text-gray-200">ESG Trend</h4>
            </div>
            <p className="text-gray-300 mb-3">
              Over the selected time period, the average ESG score has 
              <strong className={esgTrend >= 0 ? 'text-green-400' : 'text-red-400'}>
                {esgTrend >= 0 ? ' increased ' : ' decreased '}
              </strong>
              by <strong>{Math.abs(esgTrend).toFixed(1)}</strong> points.
              {esgTrend >= 0 
                ? ' This shows positive momentum in ESG adoption.'
                : ' This indicates declining ESG performance that needs attention.'
              }
            </p>
            <div className="mt-4 p-3 bg-dark-900 rounded">
              <p className="text-sm text-gray-400">
                {esgTrend >= 0 
                  ? '✓ Companies are improving their sustainability practices'
                  : '⚠ ESG initiatives may need reinforcement'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Insights */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-100 mb-6">Industry Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-green-900/20 to-dark-800 rounded-lg border border-green-700/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h4 className="text-lg font-semibold text-gray-200">Top Performing Industry</h4>
            </div>
            <p className="text-2xl font-bold text-green-400 mb-2">{bestIndustry.Industry}</p>
            <p className="text-gray-300 mb-4">
              Leading with an average ESG score of <strong>{bestIndustry.ESG_Overall?.toFixed(1)}</strong>
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Environmental:</span>
                <span className="text-gray-200">{bestIndustry.ESG_Environmental?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Social:</span>
                <span className="text-gray-200">{bestIndustry.ESG_Social?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Governance:</span>
                <span className="text-gray-200">{bestIndustry.ESG_Governance?.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-red-900/20 to-dark-800 rounded-lg border border-red-700/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <h4 className="text-lg font-semibold text-gray-200">Needs Improvement</h4>
            </div>
            <p className="text-2xl font-bold text-red-400 mb-2">{worstIndustry.Industry}</p>
            <p className="text-gray-300 mb-4">
              Average ESG score of <strong>{worstIndustry.ESG_Overall?.toFixed(1)}</strong> indicates opportunity for growth
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Environmental:</span>
                <span className="text-gray-200">{worstIndustry.ESG_Environmental?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Social:</span>
                <span className="text-gray-200">{worstIndustry.ESG_Social?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Governance:</span>
                <span className="text-gray-200">{worstIndustry.ESG_Governance?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Insights */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-100 mb-6">Environmental Impact Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
            <h4 className="text-lg font-semibold text-gray-200 mb-3">Carbon Emissions Trend</h4>
            <p className="text-gray-300 mb-3">
              Carbon emissions have 
              <strong className={carbonEmissionTrend <= 0 ? 'text-green-400' : 'text-red-400'}>
                {carbonEmissionTrend <= 0 ? ' decreased ' : ' increased '}
              </strong>
              by <strong>{Math.abs(carbonEmissionTrend).toFixed(1)}%</strong> over the selected period.
            </p>
            <div className="mt-4 p-3 bg-dark-900 rounded">
              <p className="text-sm text-gray-400">
                {carbonEmissionTrend <= 0 
                  ? '✓ Companies are successfully reducing their carbon footprint'
                  : '⚠ Carbon emissions are rising and need immediate attention'
                }
              </p>
            </div>
          </div>

          <div className="p-6 bg-dark-800 rounded-lg border border-dark-700">
            <h4 className="text-lg font-semibold text-gray-200 mb-3">Environmental Score</h4>
            <p className="text-gray-300 mb-3">
              The average environmental score is <strong className="text-primary-400">{overview.avgEnvironmentalScore.toFixed(1)}</strong>.
              {overview.avgEnvironmentalScore >= 60
                ? ' Companies are demonstrating strong environmental stewardship.'
                : ' There is significant opportunity to improve environmental practices.'
              }
            </p>
            <div className="mt-4">
              <div className="w-full bg-dark-900 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overview.avgEnvironmentalScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="card bg-gradient-to-br from-primary-900/20 to-dark-900 border-primary-700/30">
        <h3 className="text-xl font-semibold text-gray-100 mb-6">Key Takeaways</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-primary-500/10 rounded">
              <CheckCircle className="h-4 w-4 text-primary-400" />
            </div>
            <p className="text-gray-300">
              <strong className="text-gray-100">ESG Performance:</strong> The portfolio shows an average ESG score of {overview.avgESGScore.toFixed(1)}, 
              with {overview.avgESGScore >= 60 ? 'strong' : 'moderate'} commitment to sustainability principles.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-primary-500/10 rounded">
              <CheckCircle className="h-4 w-4 text-primary-400" />
            </div>
            <p className="text-gray-300">
              <strong className="text-gray-100">Industry Leadership:</strong> {bestIndustry.Industry} leads in ESG performance 
              with a score of {bestIndustry.ESG_Overall?.toFixed(1)}, setting the benchmark for other industries.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-primary-500/10 rounded">
              <CheckCircle className="h-4 w-4 text-primary-400" />
            </div>
            <p className="text-gray-300">
              <strong className="text-gray-100">Growth Trajectory:</strong> Companies are showing an average growth rate 
              of {overview.avgGrowthRate.toFixed(1)}%, indicating {overview.avgGrowthRate >= 0 ? 'positive' : 'challenging'} market conditions.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-primary-500/10 rounded">
              <CheckCircle className="h-4 w-4 text-primary-400" />
            </div>
            <p className="text-gray-300">
              <strong className="text-gray-100">Environmental Focus:</strong> {carbonEmissionTrend <= 0 ? 'Decreasing' : 'Increasing'} carbon 
              emissions trend suggests {carbonEmissionTrend <= 0 ? 'effective' : 'need for improved'} environmental management strategies.
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default KeyInsights
