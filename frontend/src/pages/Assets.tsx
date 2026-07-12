import { useEffect, useState, FormEvent } from 'react'
import { api } from '../lib/api'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'

interface Asset {
  id: string
  name: string
  category: string
  status: string
  location?: string
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function loadAssets() {
    setLoading(true)
    api.getAssets()
      .then(setAssets)
      .catch(() => setAssets([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAssets()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.createAsset({ name, category, location, status: 'AVAILABLE' })
      setName('')
      setCategory('')
      setLocation('')
      setShowForm(false)
      loadAssets()
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
          <h1 className="font-display text-2xl font-semibold text-text">Assets</h1>
          <p className="mt-1 text-sm text-text-muted">Every asset your organization owns, in one place</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-indigo px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-soft"
        >
          + New asset
        </button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <input
              required
              placeholder="Asset name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <input
              required
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Adding…' : 'Add asset'}
            </button>
          </form>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="p-8 text-center text-sm text-text-muted">Loading assets…</div>
        ) : assets.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">No assets yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft font-mono text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="px-5 py-3.5 font-medium text-text">{asset.name}</td>
                  <td className="px-5 py-3.5 text-text-muted">{asset.category}</td>
                  <td className="px-5 py-3.5 text-text-muted">{asset.location || '—'}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={asset.status as any} />
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
