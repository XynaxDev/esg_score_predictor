import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthHeader() {
  return (
    <div className="px-6 py-6">
      <Link to="/" className="inline-flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary-600/20 border border-primary-500/30">
          <span className="h-3 w-3 rounded bg-primary-500" />
        </span>
        <span className="text-gray-100 font-semibold">ESG Analytics</span>
      </Link>
    </div>
  )
}
