import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { Asset } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { StatusBadge } from '../components/StatusBadge';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function loadAssets() {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/assets');
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/assets', { name, category, location: location || undefined });
      setName('');
      setCategory('');
      setLocation('');
      setShowForm(false);
      loadAssets();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create asset');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#12141C]">
              Assets
            </h1>
            <p className="mt-1 text-[13px] text-[#6B7280]">
              {assets.length} asset{assets.length === 1 ? '' : 's'} tracked
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="rounded-md bg-[#2451FF] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              {showForm ? 'Cancel' : '+ New asset'}
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 rounded-lg border border-[#E3E5ED] bg-white p-5 shadow-sm"
          >
            {formError && (
              <div className="mb-4 rounded-md bg-[#FDECEC] px-3 py-2 text-[13px] text-[#DC2626]">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                  placeholder="Dell Laptop"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">
                  Category
                </label>
                <input
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                  placeholder="Electronics"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                  placeholder="Office A"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 rounded-md bg-[#12141C] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Adding…' : 'Add asset'}
            </button>
          </form>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-[#FDECEC] px-3 py-2 text-[13px] text-[#DC2626]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[13px] text-[#6B7280]">Loading assets…</div>
        ) : assets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#E3E5ED] bg-white py-16 text-center">
            <p className="text-[13px] text-[#6B7280]">No assets yet.</p>
            {canManage && (
              <p className="mt-1 text-[13px] text-[#6B7280]">
                Add your first asset to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#E3E5ED] bg-white shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E3E5ED] bg-[#FAFBFC] text-[11px] uppercase tracking-wider text-[#9AA1AF]">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-[#F1F2F5] last:border-0 hover:bg-[#FAFBFC]">
                    <td className="px-5 py-3 font-medium text-[#12141C]">{a.name}</td>
                    <td className="px-5 py-3 text-[#6B7280]">{a.category}</td>
                    <td className="px-5 py-3 text-[#6B7280]">{a.location || '—'}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {a.status === 'AVAILABLE' && (
                        <button
                          onClick={() => navigate(`/bookings?assetId=${a.id}`)}
                          className="text-[12px] font-medium text-[#2451FF] hover:underline"
                        >
                          Book →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
