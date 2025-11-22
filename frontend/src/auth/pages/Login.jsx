import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import AuthCard from '../../components/ui/AuthCard'
import { FiMail, FiLock } from 'react-icons/fi'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Login to access the ESG Analytics Dashboard"
      footer={
        <div className="space-y-1">
          <div>
            Don’t have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300">Create one</Link>
          </div>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-200">Back to Home</Link>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="you@company.com"
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-gray-300">Forgot?</Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 font-semibold text-white transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthCard>
  )
}
