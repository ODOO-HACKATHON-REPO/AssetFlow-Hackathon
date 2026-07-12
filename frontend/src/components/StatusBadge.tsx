type Status = 'AVAILABLE' | 'ALLOCATED' | 'MAINTENANCE' | 'RETIRED' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'

const statusConfig: Record<Status, { color: string; dot: string; label: string }> = {
  AVAILABLE: { color: 'text-status-available', dot: 'bg-status-available', label: 'Available' },
  ALLOCATED: { color: 'text-status-inuse', dot: 'bg-status-inuse', label: 'Allocated' },
  MAINTENANCE: { color: 'text-status-risk', dot: 'bg-status-risk', label: 'Maintenance' },
  RETIRED: { color: 'text-text-faint', dot: 'bg-text-faint', label: 'Retired' },
  CONFIRMED: { color: 'text-status-available', dot: 'bg-status-available', label: 'Confirmed' },
  PENDING: { color: 'text-status-inuse', dot: 'bg-status-inuse', label: 'Pending' },
  CANCELLED: { color: 'text-status-critical', dot: 'bg-status-critical', label: 'Cancelled' },
  COMPLETED: { color: 'text-text-muted', dot: 'bg-text-faint', label: 'Completed' },
}

export function StatusBadge({ status, pulse = false }: { status: Status; pulse?: boolean }) {
  const config = statusConfig[status] ?? statusConfig.PENDING

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface-raised px-2.5 py-1 font-mono text-xs ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${pulse ? 'status-pulse' : ''}`} />
      {config.label}
    </span>
  )
}
