import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Asset, Booking } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { StatusBadge } from '../components/StatusBadge';

export function Bookings() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(Boolean(searchParams.get('assetId')));

  const [assetId, setAssetId] = useState(searchParams.get('assetId') || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [bookingsData, assetsData] = await Promise.all([
        api.get('/bookings'),
        api.get('/assets'),
      ]);
      setBookings(bookingsData);
      setAssets(assetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        assetId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        purpose: purpose || undefined,
      });
      setAssetId('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setActionError('');
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update booking');
    }
  }

  const availableAssets = assets.filter((a) => a.status === 'AVAILABLE' || a.id === assetId);

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#12141C]">
              Bookings
            </h1>
            <p className="mt-1 text-[13px] text-[#6B7280]">
              {canManage ? 'All team bookings' : 'Your bookings'}
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-[#2451FF] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            {showForm ? 'Cancel' : '+ New booking'}
          </button>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">
                  Asset
                </label>
                <select
                  required
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] bg-white px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                >
                  <option value="" disabled>
                    Select an asset
                  </option>
                  {availableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">
                  Start time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">
                  End time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[12px] font-medium text-[#12141C]">
                  Purpose (optional)
                </label>
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-md border border-[#E3E5ED] px-3 py-2 text-[14px] outline-none focus:border-[#2451FF]"
                  placeholder="Client demo"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 rounded-md bg-[#12141C] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Booking…' : 'Confirm booking'}
            </button>
          </form>
        )}

        {(error || actionError) && (
          <div className="mb-4 rounded-md bg-[#FDECEC] px-3 py-2 text-[13px] text-[#DC2626]">
            {error || actionError}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[13px] text-[#6B7280]">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#E3E5ED] bg-white py-16 text-center">
            <p className="text-[13px] text-[#6B7280]">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#E3E5ED] bg-white shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E3E5ED] bg-[#FAFBFC] text-[11px] uppercase tracking-wider text-[#9AA1AF]">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">Start</th>
                  <th className="px-5 py-3 font-medium">End</th>
                  <th className="px-5 py-3 font-medium">Purpose</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#F1F2F5] last:border-0 hover:bg-[#FAFBFC]">
                    <td className="px-5 py-3 font-medium text-[#12141C]">
                      {b.asset?.name || b.assetId}
                    </td>
                    <td className="px-5 py-3 text-[#6B7280]">
                      {new Date(b.startTime).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-[#6B7280]">
                      {new Date(b.endTime).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-[#6B7280]">{b.purpose || '—'}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateStatus(b.id, 'CANCELLED')}
                          className="text-[12px] font-medium text-[#DC2626] hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      {canManage && b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateStatus(b.id, 'COMPLETED')}
                          className="ml-3 text-[12px] font-medium text-[#16A34A] hover:underline"
                        >
                          Complete
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
