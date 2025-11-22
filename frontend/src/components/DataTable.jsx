import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, Download, Filter, X, SortAsc, SortDesc, BarChart3 } from 'lucide-react'

const DataTable = ({ data, columns, title, exportable = true, showInsights = true }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [columnFilters, setColumnFilters] = useState({})
  // filterMenu holds { index, anchor } where anchor is the filter icon element
  const [filterMenu, setFilterMenu] = useState(null)
  const [showInsightsPanel, setShowInsightsPanel] = useState(false)
  const rowsPerPage = 10
  const dropdownRef = useRef(null)

  // Recompute position on scroll/resize so the menu stays attached to the icon
  const [posTick, setPosTick] = useState(0)
  useEffect(() => {
    if (!filterMenu?.anchor) return
    const handler = () => setPosTick(t => t + 1)
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
    }
  }, [filterMenu])

  // Close when clicking outside the dropdown or the anchor icon
  useEffect(() => {
    if (!filterMenu) return
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !filterMenu.anchor.contains(e.target)) {
        setFilterMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterMenu])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1) // Reset to first page on sort
  }

  const addColumnFilter = (columnKey, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
    setCurrentPage(1) // Reset to first page on filter
  }

  const removeColumnFilter = (columnKey) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[columnKey]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setColumnFilters({})
    setCurrentPage(1)
  }

  const openFilterMenu = (index, event) => {
    const anchor = event.currentTarget
    setFilterMenu(prev => (prev?.index === index ? null : { index, anchor }))
  }

  // Apply column filters
  let filteredData = [...data]
  Object.entries(columnFilters).forEach(([key, filterValue]) => {
    filteredData = filteredData.filter(row => {
      const cellValue = String(row[key] || '').toLowerCase()
      return cellValue.includes(filterValue.toLowerCase())
    })
  })

  // Sort filtered data
  const sortedData = filteredData.sort((a, b) => {
    if (!sortConfig.key) return 0
    
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  const activeFiltersCount = Object.keys(columnFilters).length

  // Calculate insights for numeric columns
  const insights = useMemo(() => {
    if (!showInsights || !data.length) return null

    const stats = {}
    columns.forEach(column => {
      const values = data.map(row => row[column.key]).filter(v => v != null)
      const numericValues = values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v))
      
      if (numericValues.length > 0) {
        const sorted = [...numericValues].sort((a, b) => a - b)
        const sum = numericValues.reduce((a, b) => a + b, 0)
        const mean = sum / numericValues.length
        const median = sorted[Math.floor(sorted.length / 2)]
        
        stats[column.key] = {
          count: values.length,
          unique: new Set(values).size,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: mean,
          median: median,
          type: 'numeric'
        }
      } else if (values.length > 0) {
        stats[column.key] = {
          count: values.length,
          unique: new Set(values).size,
          type: 'categorical'
        }
      }
    })
    return stats
  }, [data, columns, showInsights])

  const getColumnType = (columnKey) => {
    if (!data.length) return 'text'
    const value = data[0][columnKey]
    return !isNaN(parseFloat(value)) && isFinite(value) ? 'number' : 'text'
  }

  const handleExport = () => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...sortedData.map(row => 
        columns.map(col => {
          const value = col.accessor(row)
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-md">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
              </span>
              <button
                onClick={clearAllFilters}
                className="p-1 hover:bg-dark-800 rounded transition-colors"
                title="Clear all filters"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
          )}
        </div>
        {exportable && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-200 rounded-lg transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filter Dropdown Portal - Outside table */}
      {filterMenu && (() => {
        const { index, anchor } = filterMenu
        const column = columns[index]
        const columnType = getColumnType(column?.key)
        const uniqueValues = [...new Set(data.map(row => row[column?.key]).filter(Boolean))].sort()
        const dropdownWidth = 260
        const padding = 8
        const estimatedHeight = 320
        const rect = anchor.getBoundingClientRect()
        // Place directly below the icon, horizontally centered
        const desiredLeft = rect.left - (dropdownWidth - rect.width) / 2
        const clampedLeft = Math.min(Math.max(padding, desiredLeft), window.innerWidth - dropdownWidth - padding)
        const clampedTop = rect.bottom + 8
        return (
          <>
            <div ref={dropdownRef} className="fixed z-30" style={{ top: `${clampedTop}px`, left: `${clampedLeft}px`, width: `${dropdownWidth}px` }}>
              {/* Caret linking to the icon */}
              <div
                className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-dark-800 border-l-2 border-t-2 border-dark-700`}
              ></div>
              <div className="w-64 max-h-[70vh] overflow-auto bg-dark-800 backdrop-blur-xl border-2 border-dark-700 rounded-lg shadow-2xl p-3 relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-200">Filter Options</label>
                    <span className="text-xs text-gray-500">{columnType === 'number' ? 'Numeric' : 'Text'}</span>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleSort(column.key)
                        setFilterMenu(null)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 text-sm text-gray-300 rounded-md transition-colors"
                    >
                      <SortAsc className="h-4 w-4" />
                      Sort {columnType === 'number' ? 'Min → Max' : 'A → Z'}
                    </button>
                    <button
                      onClick={() => {
                        handleSort(column.key)
                        if (sortConfig.key === column.key && sortConfig.direction === 'asc') {
                          handleSort(column.key)
                        }
                        setFilterMenu(null)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 text-sm text-gray-300 rounded-md transition-colors"
                    >
                      <SortDesc className="h-4 w-4" />
                      Sort {columnType === 'number' ? 'Max → Min' : 'Z → A'}
                    </button>
                  </div>

                  <div className="border-t border-dark-700 pt-2">
                    <label className="text-xs font-medium text-gray-400 mb-2 block">Search:</label>
                    <input
                      type="text"
                      placeholder={`Search ${column.header}...`}
                      value={columnFilters[column?.key] || ''}
                      onChange={(e) => addColumnFilter(column?.key, e.target.value)}
                      className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Live Suggestions */}
                  {columnType === 'text' && (columnFilters[column?.key] || '').length > 0 && (
                    <div className="pt-2">
                      <div className="max-h-36 overflow-y-auto space-y-1">
                        {uniqueValues
                          .filter(v => String(v).toLowerCase().includes(String(columnFilters[column?.key]).toLowerCase()))
                          .slice(0, 10)
                          .map(value => (
                            <button
                              key={`sugg-${value}`}
                              onClick={() => {
                                addColumnFilter(column?.key, value)
                                setFilterMenu(null)
                              }}
                              className="w-full text-left px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-gray-300 rounded transition-colors"
                            >
                              {value}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Select - show up to 12 always for text columns */}
                  {columnType === 'text' && uniqueValues.length > 1 && (
                    <div className="border-t border-dark-700 pt-2">
                      <label className="text-xs font-medium text-gray-400 mb-2 block">Quick Select:</label>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {uniqueValues.slice(0, 12).map(value => (
                          <button
                            key={`quick-${value}`}
                            onClick={() => {
                              addColumnFilter(column?.key, value)
                              setFilterMenu(null)
                            }}
                            className="w-full text-left px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-gray-300 rounded transition-colors"
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {columnFilters[column?.key] && (
                    <button
                      onClick={() => {
                        removeColumnFilter(column?.key)
                        setFilterMenu(null)
                      }}
                      className="w-full px-3 py-1.5 bg-red-900/20 hover:bg-red-900/30 text-xs font-medium text-red-400 rounded-md transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      })()}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-3 px-4 text-left text-gray-400 font-medium"
                >
                  <div className="space-y-2">
                    {/* Column header with sort */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => column.sortable && handleSort(column.key)}
                        className={`flex items-center gap-2 ${column.sortable ? 'hover:text-gray-200 cursor-pointer' : ''}`}
                      >
                        {column.header}
                        {column.sortable && sortConfig.key === column.key && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      
                      {/* Filter icon */}
                      {column.filterable !== false && (
                        <button
                          onClick={(e) => openFilterMenu(index, e)}
                          className={`p-1 rounded hover:bg-dark-700 transition-colors ${
                            columnFilters[column.key] ? 'text-primary-400' : 'text-gray-500'
                          }`}
                          title="Filter column"
                        >
                          <Filter className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Active filter badge */}
                    {columnFilters[column.key] && (
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded inline-flex items-center gap-1">
                          {columnFilters[column.key]}
                          <button
                            onClick={() => removeColumnFilter(column.key)}
                            className="hover:text-primary-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-dark-800 hover:bg-dark-800 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4 text-gray-300">
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-800">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 rounded transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 hover:bg-dark-700 text-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 rounded transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Table Insights - separate inner card */}
      {showInsights && insights && (
        <div className="mt-6">
          <div className="p-4 bg-dark-900 rounded-lg border border-dark-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary-400" />
                <h4 className="text-sm font-semibold text-gray-100">Data Insights</h4>
              </div>
              <button
                onClick={() => setShowInsightsPanel(!showInsightsPanel)}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-700 transition-colors"
              >
                {showInsightsPanel ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {showInsightsPanel && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {columns.map(column => {
                  const stat = insights[column.key]
                  if (!stat) return null

                  return (
                    <div key={column.key} className="p-4 bg-dark-800/60 rounded-lg border border-dark-700">
                      <div className="text-xs font-medium text-gray-400 mb-2">{column.header}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Count:</span>
                          <span className="text-gray-300 font-medium">{stat.count}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Unique:</span>
                          <span className="text-gray-300 font-medium">{stat.unique}</span>
                        </div>
                        {stat.type === 'numeric' && (
                          <>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Min:</span>
                              <span className="text-green-400 font-medium">{stat.min.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Max:</span>
                              <span className="text-red-400 font-medium">{stat.max.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Mean:</span>
                              <span className="text-blue-400 font-medium">{stat.mean.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Median:</span>
                              <span className="text-purple-400 font-medium">{stat.median.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
