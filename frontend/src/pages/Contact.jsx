import { useState } from 'react'
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertTriangle,
  Github, Linkedin, Twitter
} from 'lucide-react'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: '' })
    try {
      const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (!service_id || !template_id || !public_key) {
        throw new Error('Email service is not configured. Please set VITE_EMAILJS_* env variables.')
      }
      const payload = {
        service_id,
        template_id,
        user_id: public_key,
        template_params: {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        }
      }
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to send message')
      setStatus({ loading: false, error: '', success: 'Message sent successfully! We will get back to you shortly.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Something went wrong', success: '' })
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="px-6 lg:px-8 pt-28 pb-10 bg-dark-950">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">Get in touch</h1>
          <p className="text-gray-400 max-w-2xl">Have questions about ESG Analytics, partnerships, or support? Send us a message and we’ll respond as soon as possible.</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/10 rounded-lg"><Mail className="h-5 w-5 text-primary-400"/></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">Email</h3>
                  <p className="text-gray-400 text-sm">support@esg-analytics.ai</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg"><Phone className="h-5 w-5 text-green-400"/></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">Phone</h3>
                  <p className="text-gray-400 text-sm">+1 (415) 555‑0132</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg"><MapPin className="h-5 w-5 text-purple-400"/></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">Location</h3>
                  <p className="text-gray-400 text-sm">Silicon Valley, CA</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="h-5 w-5 text-amber-400"/></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">Support Hours</h3>
                  <p className="text-gray-400 text-sm">Mon–Fri, 9:00–18:00 PT</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Github className="h-4 w-4"/>
                <a className="hover:text-gray-200" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                <Linkedin className="h-4 w-4"/>
                <a className="hover:text-gray-200" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                <Twitter className="h-4 w-4"/>
                <a className="hover:text-gray-200" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="mb-3 text-sm text-gray-400">Fill out the form and our team will get back to you within 1–2 business days.</div>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow space-y-4">
              {status.success && (
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded px-3 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4"/> {status.success}
                </div>
              )}
              {status.error && (
                <div className="flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-sm">
                  <AlertTriangle className="h-4 w-4"/> {status.error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Your Name</label>
                  <input name="name" value={form.name} onChange={onChange} required className="w-full rounded-md bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={onChange} required className="w-full rounded-md bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Subject</label>
                <input name="subject" value={form.subject} onChange={onChange} required className="w-full rounded-md bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={onChange} rows={6} required className="w-full rounded-md bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
              </div>
              <div className="flex items-center justify-end">
                <button type="submit" disabled={status.loading} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-60 px-4 py-2 text-sm text-white font-semibold">
                  <Send className="h-4 w-4"/>
                  {status.loading ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
