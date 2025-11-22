import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useFilterStore } from '../store/filterStore'
import { 
  LayoutDashboard, 
  Building2, 
  Globe, 
  TrendingUp, 
  Lightbulb, 
  Target,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  Brain,
  Search
} from 'lucide-react'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [datasetLabel, setDatasetLabel] = useState('')
  const [toast, setToast] = useState('')
  const location = useLocation()
  const setFilters = useFilterStore(s => s.setFilters)

  // Keep Navbar aligned with content by shifting it when sidebar is open (desktop only)
  useEffect(() => {
    const update = () => {
      const isLg = window.matchMedia('(min-width: 1024px)').matches
      const offset = isLg && sidebarOpen ? '20rem' : '0px' // w-80 = 20rem
      document.documentElement.style.setProperty('--sidebar-offset', offset)
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      document.documentElement.style.setProperty('--sidebar-offset', '0px')
      window.removeEventListener('resize', update)
    }
  }, [sidebarOpen])

  // Fetch active dataset meta
  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await api.analytics.getActiveDataset()
        if (res?.active && res?.dataset) {
          const name = res.dataset.filename || 'Active dataset'
          setDatasetLabel(prev => {
            if (prev !== name) {
              setToast(`Dataset set to: ${name}`)
              setTimeout(() => setToast(''), 3000)
            }
            return name
          })
        } else {
          setDatasetLabel('')
        }
        // Refresh filters to match the active dataset bounds
        try {
          const f = await api.getFilters()
          const yr = f?.yearRange || { min: 2015, max: 2025 }
          setFilters({
            yearRange: [Number(yr.min) || 2015, Number(yr.max) || 2025],
            industries: [],
            regions: [],
            minESGScore: 0,
            minRevenue: 0,
            maxCarbonEmissions: 999999999,
            maxEnergyConsumption: 999999999,
            minGrowthRate: -100,
          })
        } catch {}
      } catch {
        setDatasetLabel('')
      }
    }
    fetchActive()
    const onUpdate = () => fetchActive()
    window.addEventListener('dataset:updated', onUpdate)
    return () => window.removeEventListener('dataset:updated', onUpdate)
  }, [location.pathname])

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Industry Analysis', href: '/dashboard/industry', icon: Building2 },
    { name: 'Regional Insights', href: '/dashboard/regional', icon: Globe },
    { name: 'Trends Over Time', href: '/dashboard/trends', icon: TrendingUp },
    { name: 'Key Insights', href: '/dashboard/insights', icon: Lightbulb },
    { name: 'Recommendations', href: '/dashboard/recommendations', icon: Target },
    { name: 'AI Models', href: '/dashboard/models', icon: Brain },
    { name: 'Predictions Analytics', href: '/dashboard/predictions-analytics', icon: LayoutDashboard },
    { name: 'Data', href: '/dashboard/exports', icon: PanelLeftClose },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        navigation={navigation} 
        sidebarOpen={sidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Fixed mobile Sections button (does not scroll) */}
      {!mobileSidebarOpen && (
        <>
          <div className="lg:hidden fixed z-40 left-4 top-20">
            <button
              type="button"
              aria-label="Open dashboard sections"
              title="Open dashboard sections"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-200 bg-dark-800/90 hover:bg-dark-700 border border-dark-700 rounded-full shadow-sm transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <PanelLeft className="h-4 w-4 text-gray-300" />
              Sections
            </button>
          </div>

          {toast && (
            <div className="fixed right-4 top-20 z-40 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm shadow">
              {toast}
            </div>
          )}
        </>
      )}

      {/* Main content */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:pl-80' : 'lg:pl-0'}`}>
        {/* Top bar */}
        <div
          className="sticky top-28 md:top-20 lg:top-16 z-30 mt-2 flex h-10 shrink-0 items-center gap-x-3 px-4 md:px-6 lg:px-8 mx-auto max-w-7xl w-full"
        >
          {/* Desktop toggle with Tooltip */}
          {!sidebarOpen && (
            <div className="relative group">
              <button
                type="button"
                className="hidden lg:flex p-1 text-gray-400 hover:text-primary-400 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeft className="h-5 w-5" />
              </button>
              <div className="hidden group-hover:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-dark-800 text-xs text-gray-200 rounded whitespace-nowrap z-50 pointer-events-none">
                Open sidebar
              </div>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search sections..."
                className="w-full rounded-lg bg-dark-800/50 border border-dark-700 pl-10 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                onChange={(e) => {
                  const query = e.target.value.toLowerCase()
                  if (query) {
                    const match = navigation.find(item => item.name.toLowerCase().includes(query))
                    if (match) {
                      // Could add navigation logic here
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile toggle moved to fixed button above */}

          {/* Dataset label */}
          {datasetLabel && (
            <span className="ml-auto inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-dark-800/70 border border-dark-700 text-gray-300">
              <span className="inline-block h-2 w-2 rounded-full bg-primary-400" />
              Dataset: {datasetLabel}
            </span>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2 md:mt-0">
            {children}
          </div>
        </main>

        {/* Footer inside dashboard */}
        <Footer />
      </div>
    </div>
  )
}

export default Layout
