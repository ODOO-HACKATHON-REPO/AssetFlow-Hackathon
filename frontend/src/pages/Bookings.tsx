import { useEffect, useState, FormEvent } from 'react'
import { api } from '../lib/api'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'

interface Booking {
  id: string
  asset: { name: string }
  startTime: string
  endTime: string
  purpose?: string
  status: string
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [assetId, setAssetId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [purpose, setPurpose] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadBookings() {
    setLoading(true)
    api.getBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookings()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.createBooking({ assetId, startTime, endTime, purpose })
      setAssetId('')
      setStartTime('')
      setEndTime('')
      setPurpose('')
      setShowForm(false)
      loadBookings()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Bookings</h1>
          <p className="mt-1 text-sm text-text-muted">Reserve shared assets and resources</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-indigo px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-soft"
        >
          + New booking
        </button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <input
              required
              placeholder="Asset ID"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <input
              required
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <input
              required
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <input
              placeholder="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Booking…' : 'Confirm'}
            </button>
          </form>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="p-8 text-center text-sm text-text-muted">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">No bookings yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft font-mono text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">Asset</th>
                <th className="px-5 py-3 font-medium">Start</th>
                <th className="px-5 py-3 font-medium">End</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-5 py-3.5 font-medium text-text">{b.asset?.name ?? '—'}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{new Date(b.startTime).toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{new Date(b.endTime).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-text-muted">{b.purpose || '—'}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={b.status as any} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
