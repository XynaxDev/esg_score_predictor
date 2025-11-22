import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Infinity } from 'lucide-react'
import { cn } from '../utils/cn'
import DevStatus from './DevStatus'
import { useAuth } from '../auth/AuthContext'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { token, user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()

  const navWhenLoggedOut = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ]
  const navWhenLoggedIn = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Predictions', href: '/dashboard/predictions' },
    { name: 'About', href: '/about' },
  ]
  const navigation = token ? navWhenLoggedIn : navWhenLoggedOut

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname.startsWith('/dashboard')
    return location.pathname === path
  }

  return (
    <nav className="sticky top-4 z-50 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-offset, 0px)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Pill container */}
        <div className="relative flex h-16 items-center rounded-full border border-dark-700/70 bg-dark-900/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
              <Infinity className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-100">ESG Analytics</span>
              <span className="block text-xs text-gray-500">AI-Powered Insights</span>
            </div>
          </Link>

          {/* Right group: nav links + CTA */}
          <div className="hidden md:ml-auto md:flex md:items-center md:gap-x-6">
            {/* Desktop Navigation */}
            <div className="flex items-center gap-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'text-sm font-semibold transition-colors relative py-2 px-1 group',
                    isActive(item.href)
                      ? 'text-primary-400'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  {item.name}
                  {/* Simple white underline */}
                  <span
                    className={cn(
                      'pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-opacity',
                      isActive(item.href) ? 'opacity-100 bg-white/80' : 'opacity-0 group-hover:opacity-100 bg-white/50'
                    )}
                  />
                </Link>
              ))}
            </div>
            {/* Dev status (dev only) */}
            <DevStatus />
            {/* Auth/Profile */}
            <div className="relative flex items-center gap-3">
              {token ? (
                <>
                  <button
                    className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/80 text-white font-semibold select-none overflow-hidden"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Open profile menu"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()
                    )}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-10 w-44 rounded-lg border border-dark-700 bg-dark-900/95 backdrop-blur-xl shadow-xl p-1 z-50">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-dark-800">Profile</Link>
                      <Link to="/settings" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-dark-800">Settings</Link>
                      <Link to="/contact" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-dark-800">Contact</Link>
                      <button onClick={() => { setProfileOpen(false); logout() }} className="w-full text-left block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-dark-800">Logout</button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-dark-700/70 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-dark-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-primary-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 transition-colors shadow"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden ml-auto inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-dark-800 hover:text-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-800 bg-dark-900/95 backdrop-blur-xl shadow-xl z-40">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
                )}
              >
                {item.name}
              </Link>
            ))}
            {token ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-dark-800 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-dark-800 transition-colors"
                >
                  Settings
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-dark-800 transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md bg-primary-600 px-3 py-2 text-base font-semibold text-white hover:bg-primary-500 transition-colors mt-4"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout() }}
                  className="block w-full rounded-md border border-dark-700 px-3 py-2 text-base font-semibold text-gray-200 hover:bg-dark-800 transition-colors mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md border border-dark-700 px-3 py-2 text-base font-semibold text-gray-200 hover:bg-dark-800 transition-colors mt-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md bg-primary-600 px-3 py-2 text-base font-semibold text-white hover:bg-primary-500 transition-colors mt-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
