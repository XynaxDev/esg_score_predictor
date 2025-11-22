import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { FiMail } from 'react-icons/fi'
import AuthCard from '../../components/ui/AuthCard'
import OtpInput from '../../components/OtpInput'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: request, 2: verify
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | error | success
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const requestOtp = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    setLoading(true)
    try {
      const res = await api.auth.forgotPassword(email)
      setMessage(res.message || 'If an account exists, an OTP has been sent.')
      setStep(2)
      setStatus('idle')
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send OTP')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    setLoading(true)
    try {
      const res = await api.auth.verifyOtp(email, otp)
      const token = res.reset_token
      setStatus('success')
      navigate(`/reset-password?token=${encodeURIComponent(token)}`)
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid or expired OTP')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll send a one-time OTP to your email"
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

      {step === 1 && (
        <form onSubmit={requestOtp} className="space-y-4">
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
          <button className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 px-4 py-2 font-semibold text-white">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Enter OTP</label>
            <OtpInput value={otp} onChange={setOtp} state={status} />
            {status === 'error' && <p className="mt-2 text-xs text-red-400">{error || 'Please check the code and try again.'}</p>}
          </div>
          <button disabled={loading || otp.length !== 6} className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 font-semibold text-white">Verify OTP</button>
          <button type="button" onClick={() => setStep(1)} className="w-full rounded-lg bg-dark-800 border border-dark-700 px-4 py-2 text-gray-300">Resend OTP</button>
        </form>
      )}
    </AuthCard>
  )
}
