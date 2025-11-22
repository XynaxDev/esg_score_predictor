import { Construction, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const ComingSoon = ({ title = "Coming Soon", description }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 border-2 border-primary-500/20 mb-8">
          <Construction className="h-10 w-10 text-primary-400 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          {title}
        </h1>
        
        <p className="text-lg text-gray-400 mb-8">
          {description || "This feature is currently under development. We're working hard to bring you something amazing!"}
        </p>
        
        <div className="inline-flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-500 transition-colors"
          >
            Explore Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-dark-800 px-6 py-3 text-base font-semibold text-gray-200 hover:bg-dark-700 transition-colors border border-dark-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-800">
          <p className="text-sm text-gray-500">
            Want to be notified when this feature launches?{' '}
            <Link to="/contact" className="text-primary-400 hover:text-primary-300 transition-colors">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
