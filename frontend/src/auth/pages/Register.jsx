import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import AuthCard from '../../components/ui/AuthCard'
import { FiUser, FiPhone, FiMail, FiLock } from 'react-icons/fi'

export default function Register() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '', confirm: '', company_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const passwordChecks = useMemo(() => {
    const p = form.password || ''
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      digit: /\d/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
      match: form.password === form.confirm && form.confirm.length > 0,
    }
  }, [form.password, form.confirm])

  const strength = useMemo(() => {
    const total = ['length','upper','lower','digit','special'].reduce((acc, k) => acc + (passwordChecks[k] ? 1 : 0), 0)
    const labels = ['Very weak','Weak','Okay','Good','Strong','Very strong']
    const colors = ['#ef4444','#f97316','#f59e0b','#10b981','#059669','#047857']
    return { score: total, label: labels[total], color: colors[total] }
  }, [passwordChecks])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!passwordChecks.length || !passwordChecks.upper || !passwordChecks.lower || !passwordChecks.digit || !passwordChecks.special) {
      return setError('Password must be 8+ chars with uppercase, lowercase, number, and special character')
    }
    if (!passwordChecks.match) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    try {
      const { confirm, ...payload } = form
      const res = await api.auth.register(payload)
      setSuccess(res.message || 'Registration successful. Enter the OTP sent to your email to verify your account.')
      setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(form.email)}`), 800)
    } catch (err) {
      console.error('Register error:', err)
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Verify your email to access the ESG dashboard"
      footer={
        <div className="space-y-1">
          <div>
            Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link>
          </div>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-200">Back to Home</Link>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-2">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-2">{success}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Full name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="full_name"
                value={form.full_name}
                onChange={onChange}
                className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone (optional)</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Company Name (optional)</label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={onChange}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Acme Corp"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="you@company.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <div className="mt-2 h-2 rounded bg-dark-800 overflow-hidden">
            <div style={{ width: `${(strength.score/5)*100}%`, background: strength.color }} className="h-2 transition-all" />
          </div>
          <div className="text-xs text-gray-400 mt-1">Strength: <span style={{ color: strength.color }}>{strength.label}</span></div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Confirm password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Repeat password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
        </div>
        <ul className="text-xs text-gray-400 grid grid-cols-2 gap-1">
          <li className={passwordChecks.length ? 'text-emerald-400' : ''}>• 8+ characters</li>
          <li className={passwordChecks.upper ? 'text-emerald-400' : ''}>• Uppercase</li>
          <li className={passwordChecks.lower ? 'text-emerald-400' : ''}>• Lowercase</li>
          <li className={passwordChecks.digit ? 'text-emerald-400' : ''}>• Number</li>
          <li className={passwordChecks.special ? 'text-emerald-400' : ''}>• Special character</li>
          <li className={passwordChecks.match ? 'text-emerald-400' : ''}>• Passwords match</li>
        </ul>
        <button type="submit" disabled={loading || !passwordChecks.length || !passwordChecks.upper || !passwordChecks.lower || !passwordChecks.digit || !passwordChecks.special || !passwordChecks.match} className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 font-semibold text-white transition-colors">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  )
}
