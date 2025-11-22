import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function Welcome() {
  const [params] = useSearchParams()
  const email = params.get('email') || ''

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome to ESG Analytics</h1>
        <p className="mt-2 text-gray-400">Your email has been verified. You can now sign in and start exploring the dashboard.</p>
        {email && (<div className="mt-3 text-xs text-gray-500">Account: {email}</div>)}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/login" className="rounded-full bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-2">Go to Login</Link>
          <Link to="/" className="rounded-full border border-dark-700 px-6 py-2 text-gray-200 hover:bg-dark-800">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
