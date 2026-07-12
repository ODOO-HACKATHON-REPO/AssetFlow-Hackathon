import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { StatCard, Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { HealthRing } from '../components/HealthRing'
import { useAuth } from '../context/AuthContext'

interface Asset {
  id: string
  name: string
  category: string
  status: string
  location?: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAssets()
      .then(setAssets)
      .catch(() => setAssets([]))
      .finally(() => setLoading(false))
  }, [])

  const available = assets.filter((a) => a.status === 'AVAILABLE').length
  const allocated = assets.filter((a) => a.status === 'ALLOCATED').length
  const maintenance = assets.filter((a) => a.status === 'MAINTENANCE').length

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-text-faint">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total assets" value={String(assets.length)} accent="indigo" />
        <StatCard label="Available" value={String(available)} sublabel="Ready to allocate" />
        <StatCard label="In use" value={String(allocated)} sublabel="Currently allocated" accent="teal" />
        <StatCard label="Maintenance" value={String(maintenance)} sublabel="Needs attention" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-text">Asset registry</h2>
        </div>

        <Card>
          {loading ? (
            <div className="p-8 text-center text-sm text-text-muted">Loading assets…</div>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-muted">
              No assets yet. Add your first asset to get started.
            </div>
          ) : (
            <div className="divide-y divide-border-soft">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <HealthRing score={Math.floor(Math.random() * 40) + 60} size={40} />
                    <div>
                      <p className="text-sm font-medium text-text">{asset.name}</p>
                      <p className="font-mono text-xs text-text-faint">{asset.category}{asset.location ? ` · ${asset.location}` : ''}</p>
                    </div>
                  </div>
                  <StatusBadge status={asset.status as any} pulse={asset.status === 'AVAILABLE'} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
