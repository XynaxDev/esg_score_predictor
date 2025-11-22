import { useState, useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import { api } from '../utils/api'
import DataTable from '../components/DataTable'
import { 
  Target,
  Leaf,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

const Recommendations = () => {
  const { filters } = useFilterStore()
  const [overview, setOverview] = useState(null)
  const [industryData, setIndustryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [overviewData, industry] = await Promise.all([
        api.getOverview(filters),
        api.getIndustryAnalysis(filters)
      ])
      setOverview(overviewData)
      setIndustryData(industry)
    } catch (error) {
      console.error('Failed to load recommendations data:', error)
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
          <p className="mt-2 text-gray-400">Upload a CSV dataset and click Analyze to unlock tailored ESG improvement recommendations.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a href="/dashboard/exports" className="rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold px-5 py-2">Upload dataset</a>
            <a href="/contact" className="rounded-lg border border-dark-700 px-5 py-2 text-gray-200 hover:bg-dark-800">Contact support</a>
          </div>
          <p className="mt-3 text-xs text-gray-500">Accepted format: CSV. Required columns include CompanyName, Industry, Region, Year, Revenue, and ESG scores.</p>
        </div>
      </div>
    )
  }

  // Determine weakest ESG component
  const esgComponents = [
    { name: 'Environmental', score: overview.avgEnvironmentalScore, icon: Leaf },
    { name: 'Social', score: overview.avgSocialScore, icon: Users },
    { name: 'Governance', score: overview.avgGovernanceScore, icon: Shield }
  ]
  const weakestComponent = esgComponents.reduce((prev, current) => 
    (prev.score < current.score) ? prev : current
  )

  // Build a unified actions dataset for the table
  const actionsData = [
    { Action: 'Reduce Carbon Footprint', Area: 'Environmental', Priority: 'High', Impact: 'High', Timeline: '0-3 Months', Owner: 'Sustainability' },
    { Action: 'Sustainable Resource Management', Area: 'Environmental', Priority: 'Medium', Impact: 'Medium', Timeline: '3-6 Months', Owner: 'Operations' },
    { Action: 'Green Supply Chain', Area: 'Environmental', Priority: 'Medium', Impact: 'High', Timeline: '6-12 Months', Owner: 'Procurement' },
    { Action: 'Employee Well‑being', Area: 'Social', Priority: 'High', Impact: 'Medium', Timeline: '0-3 Months', Owner: 'HR' },
    { Action: 'Diversity & Inclusion', Area: 'Social', Priority: 'Medium', Impact: 'Medium', Timeline: '3-6 Months', Owner: 'HR' },
    { Action: 'Community Engagement', Area: 'Social', Priority: 'Low', Impact: 'Low', Timeline: '6-12 Months', Owner: 'CSR' },
    { Action: 'Board Diversity & Independence', Area: 'Governance', Priority: 'High', Impact: 'High', Timeline: '3-6 Months', Owner: 'Board' },
    { Action: 'Transparency & Reporting', Area: 'Governance', Priority: 'Medium', Impact: 'Medium', Timeline: '0-3 Months', Owner: 'Finance' },
    { Action: 'Ethics & Compliance', Area: 'Governance', Priority: 'High', Impact: 'High', Timeline: '0-3 Months', Owner: 'Legal' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Strategic Recommendations</h1>
        <p className="text-gray-400">
          Actionable insights to improve ESG performance and sustainability
        </p>
      </div>


      {/* Priority Actions */}
      <div className="card bg-gradient-to-br from-primary-900/20 to-dark-900 border-primary-700/30">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary-500/10 rounded-lg">
            <Target className="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Priority Actions</h3>
            <p className="text-gray-400">Immediate steps to enhance ESG performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-800/50 rounded-lg border border-primary-700/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h4 className="font-semibold text-gray-200">High Priority</h4>
            </div>
            <p className="text-sm text-gray-300">
              Focus on improving <strong>{weakestComponent.name}</strong> score (currently {weakestComponent.score.toFixed(1)})
            </p>
          </div>

          <div className="p-4 bg-dark-800/50 rounded-lg border border-primary-700/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-gray-200">Medium Priority</h4>
            </div>
            <p className="text-sm text-gray-300">
              Maintain momentum in areas with scores above 60
            </p>
          </div>

          <div className="p-4 bg-dark-800/50 rounded-lg border border-primary-700/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-gray-200">Ongoing</h4>
            </div>
            <p className="text-sm text-gray-300">
              Continue monitoring and reporting ESG metrics
            </p>
          </div>
        </div>
      </div>

      {/* Environmental Recommendations */}
      <div className="card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <Leaf className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Environmental Recommendations</h3>
            <p className="text-gray-400">Current Score: {overview.avgEnvironmentalScore.toFixed(1)}/100</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-green-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Reduce Carbon Footprint</h4>
                <p className="text-gray-300 mb-3">
                  Total carbon emissions are at {(overview.totalCarbonEmissions / 1000000).toFixed(2)}M tons. 
                  Implement carbon reduction strategies to achieve net-zero goals.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Transition to renewable energy sources for operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Implement energy efficiency programs across facilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Invest in carbon offset projects and green technologies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-green-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Sustainable Resource Management</h4>
                <p className="text-gray-300 mb-3">
                  Optimize water and energy consumption through smart monitoring and conservation practices.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Deploy IoT sensors for real-time resource monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Implement circular economy principles in operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Set measurable targets for waste reduction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-green-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Green Supply Chain</h4>
                <p className="text-gray-300 mb-3">
                  Collaborate with suppliers to ensure environmental standards throughout the value chain.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Establish supplier ESG assessment criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Prioritize local and sustainable sourcing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Track and report Scope 3 emissions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Recommendations */}
      <div className="card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <Users className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Social Recommendations</h3>
            <p className="text-gray-400">Current Score: {overview.avgSocialScore.toFixed(1)}/100</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-orange-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Employee Well-being & Development</h4>
                <p className="text-gray-300 mb-3">
                  Invest in workforce development and create a positive workplace culture.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Implement comprehensive training and upskilling programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Enhance mental health and wellness initiatives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Promote work-life balance and flexible working arrangements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-orange-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Diversity, Equity & Inclusion</h4>
                <p className="text-gray-300 mb-3">
                  Foster an inclusive environment that values diverse perspectives and backgrounds.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Set measurable diversity targets at all organizational levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Conduct regular pay equity audits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Establish employee resource groups and mentorship programs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-orange-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Community Engagement</h4>
                <p className="text-gray-300 mb-3">
                  Strengthen relationships with local communities and stakeholders.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Launch community investment and volunteer programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Support local education and skills development initiatives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Engage in transparent stakeholder dialogue</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Recommendations */}
      <div className="card">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Governance Recommendations</h3>
            <p className="text-gray-400">Current Score: {overview.avgGovernanceScore.toFixed(1)}/100</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-purple-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Board Diversity & Independence</h4>
                <p className="text-gray-300 mb-3">
                  Strengthen board composition with diverse, independent directors.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Increase board diversity in terms of gender, ethnicity, and expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Ensure majority independent board representation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Implement board evaluation and succession planning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-purple-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Transparency & Reporting</h4>
                <p className="text-gray-300 mb-3">
                  Enhance disclosure practices and stakeholder communication.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Publish comprehensive ESG reports aligned with global frameworks (GRI, SASB, TCFD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Increase transparency in executive compensation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Conduct third-party ESG audits and verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 bg-dark-800 rounded-lg border border-dark-700 hover:border-purple-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Ethics & Compliance</h4>
                <p className="text-gray-300 mb-3">
                  Strengthen ethical culture and compliance frameworks.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Implement robust anti-corruption and whistleblower policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Conduct regular ethics training for all employees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Establish clear ESG accountability at executive level</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="card bg-gradient-to-br from-dark-900 to-dark-800 border-dark-700">
        <h3 className="text-xl font-semibold text-gray-100 mb-6">Implementation Roadmap</h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-semibold">
                0-3 Months
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-200 mb-2">Quick Wins</h4>
              <p className="text-gray-400 text-sm">
                Establish ESG committee, conduct baseline assessment, set initial targets, and improve data collection systems.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-semibold">
                3-6 Months
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-200 mb-2">Foundation Building</h4>
              <p className="text-gray-400 text-sm">
                Launch priority initiatives, implement monitoring systems, begin stakeholder engagement, and publish first ESG report.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-semibold">
                6-12 Months
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-200 mb-2">Scale & Optimize</h4>
              <p className="text-gray-400 text-sm">
                Expand successful programs, integrate ESG into business strategy, achieve initial targets, and prepare for external verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-center">
              <div className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-semibold">
                12+ Months
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-200 mb-2">Continuous Improvement</h4>
              <p className="text-gray-400 text-sm">
                Maintain momentum, set ambitious long-term goals, achieve industry leadership, and drive innovation in ESG practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations
