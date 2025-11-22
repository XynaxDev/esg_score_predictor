import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import OtpInput from '../../components/OtpInput'
import AuthCard from '../../components/ui/AuthCard'
import { FiMail, FiHash } from 'react-icons/fi'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const emailFromQuery = params.get('email') || ''
  const [email, setEmail] = useState(emailFromQuery)
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState('idle') // idle | success | error
  const [message, setMessage] = useState('')
  const [resendMsg, setResendMsg] = useState('')
  const [editableEmail, setEditableEmail] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const verifyOtp = async (e) => {
    e.preventDefault()
    setMessage('')
    setStatus('idle')
    setSubmitting(true)
    try {
      const res = await api.auth.verifyEmailOtp(email, otp)
      setStatus('success')
      setMessage(res.message || 'Verified! Redirecting...')
      setTimeout(() => navigate(`/welcome?email=${encodeURIComponent(email)}`), 800)
    } catch (err) {
      setStatus('error')
      setMessage(err?.response?.data?.error || 'Invalid or expired OTP')
    } finally {
      setSubmitting(false)
    }
  }

  const resend = async (e) => {
    e.preventDefault()
    setResendMsg('')
    try {
      const res = await api.auth.resendVerification(email)
      setResendMsg(res.message || 'Verification OTP sent')
    } catch (err) {
      setResendMsg(err?.response?.data?.error || 'Failed to send verification OTP')
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={status === 'success' ? undefined : 'Enter the 6-digit OTP we sent to your email.'}
      footer={
        <div className="space-y-1">
          <div>
            Already verified? <Link to="/login" className="text-primary-400 hover:text-primary-300">Go to Login</Link>
          </div>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-200">Back to Home</Link>
          </div>
        </div>
      }
    >
      {status === 'success' && <div className="text-emerald-300 mb-4">{message}</div>}
      {status === 'error' && <div className="text-red-300 mb-4">{message}</div>}

      <form onSubmit={verifyOtp} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setMessage('') }}
              readOnly={!editableEmail}
              required
              className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button type="button" onClick={() => setEditableEmail(v => !v)} className="mt-2 text-xs text-gray-400 hover:text-gray-200">
            {editableEmail ? 'Lock email' : 'Change email'}
          </button>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">6-digit OTP</label>
          <OtpInput value={otp} onChange={(v)=>{ setOtp(v); setStatus('idle'); setMessage('') }} length={6} state={status === 'error' ? 'error' : (status === 'success' ? 'success' : 'idle')} className="mt-1" />
          {status === 'error' && <p className="mt-2 text-xs text-red-400">{message || 'Please check the code and try again.'}</p>}
          {status === 'success' && <p className="mt-2 text-xs text-emerald-400">{message}</p>}
        </div>
        <button disabled={otp.length !== 6 || submitting} className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 font-semibold text-white">{submitting ? 'Verifying…' : 'Verify'}</button>
      </form>
      <form onSubmit={resend} className="flex items-center gap-2 mt-3">
        <button className="rounded-lg bg-dark-800 border border-dark-700 px-4 py-2 text-gray-300 hover:bg-dark-700">Resend OTP</button>
        {resendMsg && <div className="text-gray-300 text-sm">{resendMsg}</div>}
      </form>
    </AuthCard>
  )
}
