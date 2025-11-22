import { Link } from 'react-router-dom'
import { Mail, ShieldCheck, KeyRound } from 'lucide-react'

export default function EmailTemplates() {
  return (
    <div className="min-h-[60vh] px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Email Templates</h1>
        <p className="text-gray-400 mb-6">Preview and send test emails for common flows.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/email-templates/welcome" className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5 hover:bg-dark-900 transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/30"><Mail className="h-5 w-5 text-primary-400"/></div>
              <h3 className="text-gray-100 font-semibold">Welcome Email</h3>
            </div>
            <p className="text-sm text-gray-400">Warm greeting with brand, quick start links and support.</p>
          </Link>

          <Link to="/email-templates/verify-otp" className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5 hover:bg-dark-900 transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"><ShieldCheck className="h-5 w-5 text-emerald-400"/></div>
              <h3 className="text-gray-100 font-semibold">Verify Email (OTP)</h3>
            </div>
            <p className="text-sm text-gray-400">6‑digit code with guidance and support links.</p>
          </Link>

          <Link to="/email-templates/reset-otp" className="rounded-2xl border border-dark-800 bg-dark-900/70 p-5 hover:bg-dark-900 transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30"><KeyRound className="h-5 w-5 text-amber-400"/></div>
              <h3 className="text-gray-100 font-semibold">Reset Password (OTP)</h3>
            </div>
            <p className="text-sm text-gray-400">6‑digit reset code with security tips.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
