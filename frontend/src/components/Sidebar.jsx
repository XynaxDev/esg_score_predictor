import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn'
import FilterPanel from './FilterPanel'

const Sidebar = ({ navigation, sidebarOpen, mobileSidebarOpen, setMobileSidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const [filtersOpen, setFiltersOpen] = useState(true)
  return (
    <>
      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:z-40 lg:flex lg:w-80 lg:flex-col transition-all duration-300',
        sidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'
      )}>
        <div className="flex h-full flex-col bg-dark-900/95 backdrop-blur-xl border-r border-dark-700 px-6 pt-0 pb-2 overflow-y-auto no-scrollbar">
          {/* Desktop header (sticky) */}
          <div className="hidden lg:flex items-center justify-between sticky top-0 z-10 -mx-6 px-6 pt-4 pb-3 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700 mb-2">
            <h2 className="text-sm font-bold text-gray-200">Dashboard Sections</h2>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-primary-400 rounded-md transition-colors"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              title="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col mt-2">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            'group flex items-center gap-x-3 rounded-lg p-3 text-sm font-semibold transition-all duration-200',
                            isActive
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                              : 'text-gray-400 hover:text-white hover:bg-dark-800/70 hover:translate-x-1'
                          )}
                        >
                          {item.icon && (
                            <item.icon
                              className={cn(
                                'h-5 w-5 shrink-0 transition-transform duration-200',
                                isActive ? 'scale-110' : 'group-hover:scale-110'
                              )}
                            />
                          )}
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              {/* Separator */}
              <li>
                <div className="my-3 border-t border-dark-700/60" />
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-dark-800/60"
                  onClick={() => setFiltersOpen((v)=>!v)}
                >
                  <span>Filters</span>
                  <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', filtersOpen ? 'rotate-180' : '')} />
                </button>
                {filtersOpen && (
                  <div className="mt-2">
                    <FilterPanel showHeader={false} />
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 left-0 z-50 flex w-80 flex-col transition-all duration-300 lg:hidden shadow-2xl',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col gap-y-5 overflow-y-auto no-scrollbar bg-dark-900/98 backdrop-blur-xl border-r border-dark-700 px-6 pt-6 pb-2">
          {/* Mobile header */}
          <div className="flex shrink-0 items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-100">Dashboard Menu</h2>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-primary-400 transition-colors"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col mt-2">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={cn(
                            'group flex items-center gap-x-3 rounded-lg p-3 text-sm font-semibold transition-all duration-200',
                            isActive
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                              : 'text-gray-400 hover:text-white hover:bg-dark-800/70 hover:translate-x-1'
                          )}
                        >
                          {item.icon && (
                            <item.icon
                              className={cn(
                                'h-5 w-5 shrink-0 transition-transform duration-200',
                                isActive ? 'scale-110' : 'group-hover:scale-110'
                              )}
                            />
                          )}
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              {/* Separator and Filters (mobile) */}
              <li>
                <div className="my-3 border-t border-dark-700/60" />
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-dark-800/60"
                  onClick={() => setFiltersOpen((v)=>!v)}
                >
                  <span>Filters</span>
                  <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', filtersOpen ? 'rotate-180' : '')} />
                </button>
                {filtersOpen && (
                  <div className="mt-2">
                    <FilterPanel showHeader={false} />
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
