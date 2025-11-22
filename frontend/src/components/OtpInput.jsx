import React, { useMemo, useRef, useEffect, useState } from 'react'

// A11y-friendly OTP input with 6 boxes, auto-advance, paste support, arrows/backspace nav
export default function OtpInput({ length = 6, value = '', onChange, disabled = false, className = '', maskAfterMs = 800, state = 'idle' /* idle|error|success */ }) {
  const digits = useMemo(() => {
    const v = (value || '').replace(/\D/g, '').slice(0, length)
    return Array.from({ length }, (_, i) => v[i] || '')
  }, [value, length])

  const refs = useRef([])
  const [reveal, setReveal] = useState(() => Array(length).fill(false))
  const timers = useRef([])
  useEffect(() => {
    refs.current = refs.current.slice(0, length)
    timers.current = timers.current.slice(0, length)
    setReveal((prev) => {
      const next = Array(length).fill(false)
      for (let i = 0; i < Math.min(prev.length, length); i++) next[i] = prev[i]
      return next
    })
  }, [length])

  const setChar = (index, ch) => {
    const clean = (value || '').replace(/\D/g, '')
    const arr = clean.split('')
    arr[index] = ch
    const next = arr.join('').slice(0, length)
    onChange && onChange(next)
  }

  const handleChange = (e, i) => {
    const inputVal = e.target.value.replace(/\D/g, '')
    if (!inputVal) {
      setChar(i, '')
      return
    }
    // If user pasted or typed multiple digits
    const current = (value || '').replace(/\D/g, '')
    const left = current.slice(0, i)
    const right = current.slice(i + 1)
    const merged = (left + inputVal + right).slice(0, length)
    onChange && onChange(merged)
    // reveal each filled slot briefly
    const count = Math.min(inputVal.length, length - i)
    for (let k = 0; k < count; k++) {
      const idx = i + k
      setReveal((r) => {
        const cp = r.slice(); cp[idx] = true; return cp
      })
      clearTimeout(timers.current[idx])
      timers.current[idx] = setTimeout(() => {
        setReveal((r) => { const cp = r.slice(); cp[idx] = false; return cp })
      }, maskAfterMs)
    }
    const jump = Math.min(i + inputVal.length, length - 1)
    refs.current[jump]?.focus()
  }

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !digits[i]) {
      const prev = Math.max(i - 1, 0)
      refs.current[prev]?.focus()
      if (prev !== i) {
        // Clear previous
        const arr = digits.slice()
        arr[prev] = ''
        onChange && onChange(arr.join(''))
      }
    } else if (e.key === 'ArrowLeft') {
      refs.current[Math.max(i - 1, 0)]?.focus()
    } else if (e.key === 'ArrowRight') {
      refs.current[Math.min(i + 1, length - 1)]?.focus()
    }
  }

  const handlePaste = (e, i) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '')
    if (!text) return
    e.preventDefault()
    const current = (value || '').replace(/\D/g, '')
    const left = current.slice(0, i)
    const right = current.slice(i + 1)
    const merged = (left + text + right).slice(0, length)
    onChange && onChange(merged)
    for (let k = 0; k < text.length && (i + k) < length; k++) {
      const idx = i + k
      setReveal((r) => { const cp = r.slice(); cp[idx] = true; return cp })
      clearTimeout(timers.current[idx])
      timers.current[idx] = setTimeout(() => {
        setReveal((r) => { const cp = r.slice(); cp[idx] = false; return cp })
      }, maskAfterMs)
    }
    const jump = Math.min(i + text.length, length - 1)
    refs.current[jump]?.focus()
  }

  return (
    <div className={`w-full flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={reveal[i] ? digits[i] : (digits[i] ? '•' : '')}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          aria-label={`Digit ${i + 1}`}
          className={[
            'w-10 h-12 text-center text-lg font-semibold rounded-md bg-dark-800 border text-gray-100 focus:outline-none focus:ring-2',
            state === 'error' ? 'border-red-500/60 focus:ring-red-500/50' : state === 'success' ? 'border-emerald-500/60 focus:ring-emerald-500/50' : 'border-dark-700 focus:ring-primary-500'
          ].join(' ')}
        />
      ))}
    </div>
  )
}
