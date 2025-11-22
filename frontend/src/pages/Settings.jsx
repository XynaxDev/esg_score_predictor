import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../auth/AuthContext'
import { FiUser, FiPhone, FiBriefcase, FiMail, FiShield, FiArrowLeft, FiTrash2 } from 'react-icons/fi'

export default function Settings() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', phone: '', company_name: '', prefs: { email_updates: true } })
  const [pw, setPw] = useState({ current: '', next: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [del, setDel] = useState({ password: '' })
  const [delMsg, setDelMsg] = useState('')
  const [delErr, setDelErr] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const me = await api.auth.me()
        const u = me.user || user
        setForm({
          full_name: u?.full_name || '',
          phone: u?.phone || '',
          company_name: u?.company_name || '',
          prefs: { email_updates: u?.prefs?.email_updates !== false },
        })
      } catch {
        // ignore
      }
    }
    load()
  }, [])

  const updateProfile = async (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      const payload = { ...form }
      const res = await api.auth.updateMe(payload)
      setMsg(res.message || 'Profile updated')
      if (res.user) setUser(res.user)
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to update profile')
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg(''); setPwErr('')
    try {
      const res = await api.auth.changePassword(pw.current, pw.next)
      setPwMsg(res.message || 'Password changed successfully')
      setPw({ current: '', next: '' })
    } catch (e) {
      setPwErr(e?.response?.data?.error || 'Failed to change password')
    }
  }

  return (
    <div className="min-h-[70vh] px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header with Back */}
        <div className="flex items-center gap-3 -mt-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-full border border-dark-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-dark-800">
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-100">Settings</h1>
        </div>
        <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-100 mb-1">Profile</h2>
          <p className="text-sm text-gray-400 mb-4">Update your account information and preferences.</p>
          {msg && <div className="mb-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm">{msg}</div>}
          {err && <div className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">{err}</div>}
          <form onSubmit={updateProfile} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="col-span-1">
              <span className="block text-sm text-gray-300 mb-1">Full name</span>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={form.full_name} onChange={(e)=>setForm(f=>({...f, full_name:e.target.value}))} className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500" />
              </div>
            </label>
            <label className="col-span-1">
              <span className="block text-sm text-gray-300 mb-1">Phone</span>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={form.phone} onChange={(e)=>setForm(f=>({...f, phone:e.target.value}))} className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500" />
              </div>
            </label>
            <label className="col-span-1">
              <span className="block text-sm text-gray-300 mb-1">Company</span>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={form.company_name} onChange={(e)=>setForm(f=>({...f, company_name:e.target.value}))} className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500" />
              </div>
            </label>
            <label className="col-span-1">
              <span className="block text-sm text-gray-300 mb-1">Email updates</span>
              <div className="flex items-center gap-2 rounded-lg bg-dark-800 border border-dark-700 px-3 py-2">
                <input id="email_updates" type="checkbox" checked={form.prefs.email_updates} onChange={(e)=>setForm(f=>({...f, prefs:{...f.prefs, email_updates:e.target.checked}}))} />
                <label htmlFor="email_updates" className="text-sm text-gray-300">Receive product updates</label>
              </div>
            </label>
            <div className="col-span-1 md:col-span-2">
              <button className="rounded-lg bg-primary-600 hover:bg-primary-500 px-4 py-2 font-semibold text-white">Save changes</button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-dark-800 bg-dark-900/70 backdrop-blur-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-100 mb-1">Change password</h2>
          <p className="text-sm text-gray-400 mb-4">Keep your account secure by using a strong password.</p>
          {pwMsg && <div className="mb-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm">{pwMsg}</div>}
          {pwErr && <div className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">{pwErr}</div>}
          <form onSubmit={changePassword} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="col-span-1">
              <span className="block text-sm text-gray-300 mb-1">Current password</span>
              <div className="relative">
                <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={pw.current} onChange={(e)=>setPw(p=>({...p, current:e.target.value}))} className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500" required />
              </div>
            </label>
            <label className="col-span-1">
              <span className="block text-sm text-gray-300 mb-1">New password</span>
              <div className="relative">
                <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={pw.next} onChange={(e)=>setPw(p=>({...p, next:e.target.value}))} className="w-full rounded-lg bg-dark-800 border border-dark-700 pl-10 pr-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500" required />
              </div>
            </label>
            <div className="col-span-1 md:col-span-2">
              <button className="rounded-lg bg-primary-600 hover:bg-primary-500 px-4 py-2 font-semibold text-white">Change password</button>
            </div>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-900/40 bg-red-900/10 backdrop-blur-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-red-300 mb-1">Danger zone</h2>
          <p className="text-sm text-red-200/80 mb-4">Deleting your account is permanent and will remove your profile, predictions and uploads.</p>
          {delMsg && <div className="mb-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm">{delMsg}</div>}
          {delErr && <div className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">{delErr}</div>}
          <form onSubmit={async (e)=>{e.preventDefault(); setDelErr(''); setDelMsg(''); try{ const res = await api.auth.deleteAccount(del.password); setDelMsg(res.message||'Account deleted'); logout(); }catch(er){ setDelErr(er?.response?.data?.error||'Failed to delete account')}}} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <label className="md:col-span-2">
              <span className="block text-sm text-gray-300 mb-1">Confirm password</span>
              <input type="password" value={del.password} onChange={(e)=>setDel({password:e.target.value})} className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-gray-100 focus:ring-2 focus:ring-red-500" required />
            </label>
            <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 font-semibold text-white"><FiTrash2/> Delete account</button>
          </form>
        </section>
      </div>
    </div>
  )
}
