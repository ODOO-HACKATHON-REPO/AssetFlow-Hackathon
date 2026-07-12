import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7FB] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#2451FF] text-[15px] font-bold text-white">
            A
          </span>
          <h1 className="font-display text-xl font-semibold tracking-tight text-[#12141C]">
            Sign in to AssetFlow
          </h1>
          <p className="mt-1 text-[13px] text-[#6B7280]">Track, book, and manage your assets</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[#E3E5ED] bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-md bg-[#FDECEC] px-3 py-2 text-[13px] text-[#DC2626]">
              {error}
            </div>
          )}

          <label className="mb-1 block text-[12px] font-medium text-[#12141C]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none transition-colors focus:border-[#2451FF]"
            placeholder="you@company.com"
          />

          <label className="mb-1 block text-[12px] font-medium text-[#12141C]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none transition-colors focus:border-[#2451FF]"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[#2451FF] py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-[#6B7280]">
          No account?{' '}
          <Link to="/register" className="font-medium text-[#2451FF]">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
