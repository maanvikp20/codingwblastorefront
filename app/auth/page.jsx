'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const FEATURES = [
  'High-quality PLA, PETG & specialty filaments',
  'Custom orders with your own STL files',
  'Fast turnaround from our student-run shop',
]

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'register'

  // Login state
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError]       = useState('')
  const [loginLoading, setLoginLoading]   = useState(false)

  // Register state
  const [regName, setRegName]         = useState('')
  const [regEmail, setRegEmail]       = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm]   = useState('')
  const [regError, setRegError]       = useState('')
  const [regLoading, setRegLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (err) {
      setLoginError(err.message || 'Failed to login. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match.')
      return
    }
    setRegLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      router.push('/')
    } catch (err) {
      setRegError(err.message || 'Failed to register. Please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen flex overflow-hidden bg-[#1a1919]">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#DC965A] flex-col justify-between p-12 relative overflow-hidden">

        {/* Background grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#242325 1px, transparent 1px), linear-gradient(90deg, #242325 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Large decorative number */}
        <div
          className="absolute -bottom-10 -right-8 text-[#242325] font-black select-none pointer-events-none"
          style={{ fontSize: '320px', lineHeight: 1, opacity: 0.12 }}
        >
          3D
        </div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#242325] rounded-lg flex items-center justify-center">
            <span className="text-[#DC965A] font-black text-sm">3D</span>
          </div>
          <span className="text-[#242325] font-bold text-lg tracking-tight">3D Print Store</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <h2 className="text-[#242325] font-black leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)' }}>
            Turn your ideas<br />
            into{' '}
            <span className="italic underline decoration-[#242325]/40 underline-offset-4">
              real objects.
            </span>
          </h2>
          <p className="text-[#242325]/75 text-base leading-relaxed max-w-sm mb-10">
            Shop our in-stock prints or submit a fully custom order with your own design files.
          </p>

          <div className="flex flex-col gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#242325] shrink-0" />
                <span className="text-[#242325]/80 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stat strip */}
        <div className="relative z-10 flex gap-8 border-t border-[#242325]/20 pt-6">
          {[['500+', 'Models'], ['48h', 'Avg. turnaround'], ['100%', 'Student-run']].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-[#242325] font-black text-2xl leading-none">{val}</div>
              <div className="text-[#242325]/60 text-xs mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#DC965A] rounded-lg flex items-center justify-center">
            <span className="text-[#242325] font-black text-xs">3D</span>
          </div>
          <span className="text-white font-bold text-base">3D Print Store</span>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Mode toggle */}
          <div className="flex bg-[#242325] rounded-xl p-1 mb-8 border border-white/5">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-[#DC965A] text-[#242325]'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── Login form ── */}
          {mode === 'login' && (
            <div>
              <h1 className="text-white font-bold text-2xl mb-1">Welcome back</h1>
              <p className="text-white/40 text-sm mb-7">Sign in to your account to continue.</p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-[#242325] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-[#242325] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                  />
                </div>

                {loginError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#DC965A] hover:bg-[#c8834a] disabled:opacity-50 text-[#242325] font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 cursor-pointer"
                >
                  {loginLoading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>

              <p className="text-white/30 text-xs text-center mt-6">
                No account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#DC965A] hover:underline font-semibold cursor-pointer"
                >
                  Create one here
                </button>
              </p>
            </div>
          )}

          {/* ── Register form ── */}
          {mode === 'register' && (
            <div>
              <h1 className="text-white font-bold text-2xl mb-1">Create an account</h1>
              <p className="text-white/40 text-sm mb-7">Join the community and start printing.</p>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-[#242325] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-[#242325] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className="w-full bg-[#242325] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                    placeholder="Repeat your password"
                    className="w-full bg-[#242325] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#DC965A] transition-colors"
                  />
                </div>

                {regError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-[#DC965A] hover:bg-[#c8834a] disabled:opacity-50 text-[#242325] font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 cursor-pointer"
                >
                  {regLoading ? 'Creating account…' : 'Create Account →'}
                </button>
              </form>

              <p className="text-white/30 text-xs text-center mt-6">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#DC965A] hover:underline font-semibold cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}