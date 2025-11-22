import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const MetricCard = ({ title, value, icon: Icon, color = 'primary', trend, previousValue }) => {
  const colorClasses = {
    primary: 'bg-primary-500/10 text-primary-400',
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    orange: 'bg-orange-500/10 text-orange-400',
    red: 'bg-red-500/10 text-red-400',
  }

  // Calculate trend if previousValue is provided
  let trendValue = trend
  let trendDirection = 'neutral'
  
  if (previousValue !== undefined && previousValue !== null) {
    const change = ((value - previousValue) / previousValue) * 100
    trendValue = Math.abs(change).toFixed(1)
    trendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  } else if (trend !== undefined) {
    trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'
    trendValue = Math.abs(trend).toFixed(1)
  }

  return (
    <div className="metric-card group hover:border-primary-700/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-100 group-hover:text-primary-400 transition-colors">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Trend Indicator */}
      {trendValue !== undefined && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-dark-800">
          {trendDirection === 'up' && (
            <>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-md">
                <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs font-semibold text-green-400">
                  {trendValue}%
                </span>
              </div>
              <span className="text-xs text-gray-500">vs baseline</span>
            </>
          )}
          {trendDirection === 'down' && (
            <>
              <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded-md">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs font-semibold text-red-400">
                  {trendValue}%
                </span>
              </div>
              <span className="text-xs text-gray-500">vs baseline</span>
            </>
          )}
          {trendDirection === 'neutral' && (
            <>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-500/10 rounded-md">
                <Minus className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400">
                  0.0%
                </span>
              </div>
              <span className="text-xs text-gray-500">no change</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MetricCard
