import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
            Create your account
          </h1>
          <p className="mt-1 text-[13px] text-[#6B7280]">Join your team's AssetFlow workspace</p>
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

          <label className="mb-1 block text-[12px] font-medium text-[#12141C]">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none transition-colors focus:border-[#2451FF]"
            placeholder="Jordan Lee"
          />

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none transition-colors focus:border-[#2451FF]"
            placeholder="••••••••"
          />

          <label className="mb-1 block text-[12px] font-medium text-[#12141C]">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-5 w-full rounded-md border border-[#E3E5ED] bg-white px-3 py-2 text-[14px] outline-none transition-colors focus:border-[#2451FF]"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[#2451FF] py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-[#6B7280]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#2451FF]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
