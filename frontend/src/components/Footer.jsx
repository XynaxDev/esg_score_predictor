import { Link } from 'react-router-dom'
import { Infinity, Github, Linkedin, Twitter } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

const Footer = () => {
  const { token } = useAuth()
  const linksWhenLoggedOut = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Login', href: '/login' },
    { name: 'Get Started', href: '/register' },
  ]
  const linksWhenLoggedIn = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Predictions', href: '/dashboard/predictions' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
  const navigation = token ? linksWhenLoggedIn : linksWhenLoggedOut
  return (
    <footer className="bg-dark-950">
      {/* Fading separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-dark-800 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Infinity className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-100">ESG Analytics</span>
              <span className="block text-[10px] text-gray-500">AI-Powered Insights</span>
            </div>
          </Link>

          {/* Nav-like links */}
          <nav className="flex items-center gap-4 text-sm">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-gray-400 hover:text-gray-200 transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex gap-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-800 hover:bg-dark-700 rounded-md transition-colors border border-dark-700/60">
              <Github className="h-4 w-4 text-gray-400" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-800 hover:bg-dark-700 rounded-md transition-colors border border-dark-700/60">
              <Linkedin className="h-4 w-4 text-gray-400" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-800 hover:bg-dark-700 rounded-md transition-colors border border-dark-700/60">
              <Twitter className="h-4 w-4 text-gray-400" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-[11px] text-gray-500">© {new Date().getFullYear()} ESG Analytics</div>
      </div>
    </footer>
  )
}

export default Footer
