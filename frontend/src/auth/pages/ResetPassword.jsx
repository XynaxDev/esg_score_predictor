import React, { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import AuthCard from '../../components/ui/AuthCard'
import { FiLock } from 'react-icons/fi'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await api.auth.resetPassword(token, password)
      setMessage(res.message || 'Password reset successfully')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }
  return (
    <AuthCard
      title="Create a new password"
      subtitle="Use the OTP link and set a strong password"
      footer={
        <div className="space-y-1">
          <div>
            Remembered it? <Link to="/login" className="text-primary-400 hover:text-primary-300">Back to Login</Link>
          </div>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-200">Back to Home</Link>
          </div>
        </div>
      }
    >
      {message && <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-2">{message}</div>}
      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">New password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Confirm password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Repeat password"
              required
              minLength={8}
            />
          </div>
        </div>
        <button disabled={loading} className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 font-semibold text-white">
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </AuthCard>
  )
}
