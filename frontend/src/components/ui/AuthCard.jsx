import React from 'react'

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-dark-900/80 backdrop-blur border border-dark-800 rounded-2xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 leading-tight">{title}</h1>
          {subtitle && <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-gray-400">{footer}</div>}
      </div>
    </div>
  )
}
