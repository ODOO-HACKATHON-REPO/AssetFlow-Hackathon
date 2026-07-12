import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-teal font-display text-lg font-bold text-base">
            A
          </div>
          <h1 className="font-display text-2xl font-semibold text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">Sign in to your AssetFlow workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border-soft bg-surface/60 p-6 backdrop-blur-sm">
          {error && (
            <div className="rounded-lg border border-status-critical/30 bg-status-critical/10 px-3 py-2 text-sm text-status-critical">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-soft disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-teal hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
