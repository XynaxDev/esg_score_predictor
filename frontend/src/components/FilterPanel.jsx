import { useState, useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import { api } from '../utils/api'
import { 
  FiFilter, 
  FiRefreshCw, 
  FiX, 
  FiChevronDown, 
  FiBriefcase, 
  FiGlobe, 
  FiCalendar, 
  FiTrendingUp 
} from 'react-icons/fi'

const FilterPanel = ({ showHeader = true }) => {
  const { filters, setFilters, resetFilters } = useFilterStore()
  const [availableFilters, setAvailableFilters] = useState({
    industries: [],
    regions: [],
    yearRange: { min: 2015, max: 2025 },
  })
  const [expandedSections, setExpandedSections] = useState({
    industries: true,
    regions: true,
    year: true,
    esg: true
  })

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await api.getFilters()
        setAvailableFilters(data)
      } catch (error) {
        console.error('Failed to fetch filters:', error)
      }
    }
    fetchFilters()
  }, [])

  const toggleIndustry = (industry) => {
    const current = filters.industries || []
    const updated = current.includes(industry)
      ? current.filter(i => i !== industry)
      : [...current, industry]
    setFilters({ ...filters, industries: updated })
  }

  const toggleRegion = (region) => {
    const current = filters.regions || []
    const updated = current.includes(region)
      ? current.filter(r => r !== region)
      : [...current, region]
    setFilters({ ...filters, regions: updated })
  }

  const removeIndustry = (industry) => {
    const updated = (filters.industries || []).filter(i => i !== industry)
    setFilters({ ...filters, industries: updated })
  }

  const removeRegion = (region) => {
    const updated = (filters.regions || []).filter(r => r !== region)
    setFilters({ ...filters, regions: updated })
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Removed sidebar export functionality per request

  const selectedCount = (filters.industries?.length || 0) + (filters.regions?.length || 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-500/10 rounded-lg">
            <FiFilter className="h-4 w-4 text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-100">Filters</h3>
          {selectedCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-dark-700 rounded hover:bg-dark-800 text-gray-300"
          title="Reset filters"
        >
          <FiRefreshCw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
      )}

      {/* Industries Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('industries')}
          className="w-full flex items-center justify-between p-2.5 hover:bg-dark-800/50 rounded-lg transition-all group"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-200"><FiBriefcase className="h-4 w-4 text-gray-400" /> Industries</span>
          <FiChevronDown 
            className={`h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-all duration-200 ${
              expandedSections.industries ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.industries && (
          <div className="space-y-2">
            {/* Selected Tags */}
            {filters.industries?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-dark-800/50 rounded-lg">
                {filters.industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => removeIndustry(industry)}
                    className="group inline-flex items-center gap-1 px-2 py-1 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-400 text-xs font-medium rounded-md transition-colors"
                  >
                    {industry}
                    <FiX className="h-3 w-3 group-hover:text-primary-300" />
                  </button>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-1.5">
              {availableFilters.industries
                .filter(industry => !filters.industries?.includes(industry))
                .map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleIndustry(industry)}
                    className="px-2 py-1 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 text-gray-300 hover:text-primary-400 text-xs font-medium rounded-md transition-all"
                  >
                    {industry}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Regions Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('regions')}
          className="w-full flex items-center justify-between p-2.5 hover:bg-dark-800/50 rounded-lg transition-all group"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-200"><FiGlobe className="h-4 w-4 text-gray-400" /> Regions</span>
          <FiChevronDown 
            className={`h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-all duration-200 ${
              expandedSections.regions ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.regions && (
          <div className="space-y-2">
            {/* Selected Tags */}
            {filters.regions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-dark-800/50 rounded-lg">
                {filters.regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => removeRegion(region)}
                    className="group inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 text-xs font-medium rounded-md transition-colors"
                  >
                    {region}
                    <FiX className="h-3 w-3 group-hover:text-purple-300" />
                  </button>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-1.5">
              {availableFilters.regions
                .filter(region => !filters.regions?.includes(region))
                .map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className="px-2 py-1 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-purple-500/50 text-gray-300 hover:text-purple-400 text-xs font-medium rounded-md transition-all"
                  >
                    {region}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Year Range Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('year')}
          className="w-full flex items-center justify-between p-2.5 hover:bg-dark-800/50 rounded-lg transition-all group"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-200"><FiCalendar className="h-4 w-4 text-gray-400" /> Year Range</span>
          <FiChevronDown 
            className={`h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-all duration-200 ${
              expandedSections.year ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.year && (
          <div className="space-y-4 p-3 bg-dark-800/30 rounded-lg">
            {/* Numeric Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">From (year)</label>
                <input
                  type="number"
                  min={availableFilters.yearRange.min}
                  max={availableFilters.yearRange.max}
                  value={filters.yearRange?.[0] ?? availableFilters.yearRange.min}
                  onChange={(e) => {
                    const val = Math.max(availableFilters.yearRange.min, Math.min(Number(e.target.value || 0), availableFilters.yearRange.max))
                    const to = filters.yearRange?.[1] ?? availableFilters.yearRange.max
                    setFilters({ ...filters, yearRange: [Math.min(val, to), to] })
                  }}
                  className="w-full rounded-md bg-dark-900 border border-dark-700 px-2.5 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">To (year)</label>
                <input
                  type="number"
                  min={availableFilters.yearRange.min}
                  max={availableFilters.yearRange.max}
                  value={filters.yearRange?.[1] ?? availableFilters.yearRange.max}
                  onChange={(e) => {
                    const val = Math.max(availableFilters.yearRange.min, Math.min(Number(e.target.value || 0), availableFilters.yearRange.max))
                    const from = filters.yearRange?.[0] ?? availableFilters.yearRange.min
                    setFilters({ ...filters, yearRange: [from, Math.max(val, from)] })
                  }}
                  className="w-full rounded-md bg-dark-900 border border-dark-700 px-2.5 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">From</label>
                <span className="text-xs font-medium text-primary-400">
                  {filters.yearRange?.[0] || availableFilters.yearRange.min}
                </span>
              </div>
              <input
                type="range"
                min={availableFilters.yearRange.min}
                max={availableFilters.yearRange.max}
                value={filters.yearRange?.[0] || availableFilters.yearRange.min}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    yearRange: [parseInt(e.target.value), filters.yearRange?.[1] || availableFilters.yearRange.max],
                  })
                }
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">To</label>
                <span className="text-xs font-medium text-primary-400">
                  {filters.yearRange?.[1] || availableFilters.yearRange.max}
                </span>
              </div>
              <input
                type="range"
                min={availableFilters.yearRange.min}
                max={availableFilters.yearRange.max}
                value={filters.yearRange?.[1] || availableFilters.yearRange.max}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    yearRange: [filters.yearRange?.[0] || availableFilters.yearRange.min, parseInt(e.target.value)],
                  })
                }
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* ESG Score Section */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('esg')}
          className="w-full flex items-center justify-between p-2.5 hover:bg-dark-800/50 rounded-lg transition-all group"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-200"><FiTrendingUp className="h-4 w-4 text-gray-400" /> Min ESG Score</span>
          <FiChevronDown 
            className={`h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-all duration-200 ${
              expandedSections.esg ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.esg && (
          <div className="space-y-3 p-3 bg-dark-800/30 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Minimum Score</label>
              <span className="text-xs font-medium text-green-400">
                {filters.minESGScore || 0}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minESGScore || 0}
              onChange={(e) =>
                setFilters({ ...filters, minESGScore: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        )}
      </div>

      {/* Export button removed */}
    </div>
  )
}

export default FilterPanel
