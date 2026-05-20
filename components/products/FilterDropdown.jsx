'use client'
import { useState, useEffect, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'

// Dropdown component for filter
export default function FilterDropdown({ icon: Icon, label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Get selected and if active
  const selected = options.find((o) => o.value === value)
  const isActive = value !== 'all' && value !== 'default'

  return (
    <div ref={ref} className="relative">
      {/* Toggle Button for Dropdown */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 whitespace-nowrap cursor-pointer ${
          isActive
            ? 'bg-[#DC965A] border-[#DC965A] text-[#242325]'
            : 'bg-[#242325] border-white/10 text-white/70 hover:text-white hover:border-white/30'
        }`}
      >
        <Icon size={13} />
        <span>{isActive ? selected?.label : label}</span>
        <FiChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Population */}
      <div
        className={`absolute top-full left-0 mt-2 w-48 bg-[#2a2929] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
        }`}
        style={{ transformOrigin: 'top' }}
      >
        <div className="p-1.5">
          {/* Map options to buttons */}
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                value === o.value
                  ? 'bg-[#DC965A] text-[#242325] font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}