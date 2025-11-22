const CustomTooltip = ({ active, payload, label, labelFormatter, valueFormatter, getColor }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const fmtNumber = (v) => {
    if (typeof v !== 'number') return v
    // Default pretty formatting with grouping and up to 2 decimals
    return v.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const nameToColor = (name = '') => {
    const n = String(name).toLowerCase()
    if (n.includes('environment')) return '#10b981'
    if (n.includes('social')) return '#f59e0b'
    if (n.includes('govern')) return '#8b5cf6'
    if (n.includes('overall') || n.includes('esg')) return '#3b82f6'
    if (n.includes('carbon')) return '#ef4444'
    if (n.includes('revenue')) return '#3b82f6'
    return '#60a5fa'
  }

  const resolveColor = (entry) => {
    const raw = entry?.payload?.stroke || entry?.stroke || entry?.payload?.fill || entry?.color
    if (typeof raw === 'string') {
      const val = raw.trim()
      // Ignore gradient URLs like url(#id)
      if (!val.startsWith('url(')) return val
    }
    return nameToColor(entry?.name || entry?.dataKey)
  }

  return (
    <div className="bg-dark-800/95 backdrop-blur-xl border border-dark-700 rounded-lg shadow-2xl p-3.5 min-w-[220px]">
      {/* Label */}
      {label && (
        <div className="text-[13px] font-semibold text-gray-100 mb-2 pb-2 border-b border-dark-700">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      
      {/* Data points */}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const color = typeof getColor === 'function' ? getColor(entry) : resolveColor(entry)
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full ring-2 ring-white/30 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-300">
                  {entry.name || entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-100 tabular-nums">
                {valueFormatter ? valueFormatter(entry.value, entry) : fmtNumber(entry.value)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Removed redundant footer label for a cleaner look */}
    </div>
  )
}

export default CustomTooltip
