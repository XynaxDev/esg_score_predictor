import { useState } from 'react'

export default function WelcomeTemplate() {
  const [email, setEmail] = useState('you@example.com')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  const send = async () => {
    setMsg('')
    const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    const template_id = import.meta.env.VITE_EMAILJS_TPL_WELCOME || import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    if (!service_id || !public_key || !template_id) { setMsg('EmailJS not configured'); return }
    try {
      setSending(true)
      const payload = {
        service_id,
        template_id,
        user_id: public_key,
        template_params: {
          to_email: email,
          subject: 'Welcome to ESG Analytics',
          greeting: 'Welcome to ESG Analytics!',
          message: 'We\'re excited to have you on board. Upload a dataset to start visualizing ESG & financial insights.'
        }
      }
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to send email')
      setMsg('Sent! Check your inbox.')
    } catch (e) {
      setMsg(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-[60vh] px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">Welcome Email</h2>
          <p className="text-sm text-gray-400 mb-4">A warm greeting to new users with quick actions and support.</p>
          <div className="space-y-3">
            <label className="block text-xs text-gray-400">Send test to</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-md bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-gray-200"/>
            <button onClick={send} disabled={sending} className="rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-4 py-2 text-white">{sending ? 'Sending…' : 'Send test email'}</button>
            {msg && <div className="text-xs text-gray-300">{msg}</div>}
          </div>
        </div>
        <div className="rounded-2xl border border-dark-800 bg-dark-900/70 p-6">
          <div className="text-sm text-gray-400 mb-3">Preview</div>
          <div className="bg-[#0b1220] p-4 rounded-lg border border-dark-800">
            <div className="bg-[#0f172a] rounded-xl border border-[#1f2937] overflow-hidden">
              <div className="p-5">
                <div className="text-gray-200 font-semibold">ESG Analytics</div>
                <div className="text-xs text-gray-500">AI‑Powered Insights</div>
                <h3 className="mt-4 text-gray-100 text-xl font-bold">Welcome to ESG Analytics!</h3>
                <p className="mt-2 text-gray-300">We\'re excited to have you on board. Upload a dataset to start visualizing ESG & financial insights.</p>
                <a className="inline-block mt-4 rounded-md bg-primary-600 text-white px-4 py-2 text-sm">Go to Login</a>
                <p className="mt-3 text-xs text-gray-500">Need help? Reply to this email or visit our Contact page.</p>
              </div>
              <div className="px-5 py-3 text-[11px] text-gray-500 border-t border-dark-800">© {new Date().getFullYear()} ESG Analytics • support@esg-analytics.ai</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
