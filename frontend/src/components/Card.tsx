import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border-soft bg-surface/60 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sublabel, accent }: { label: string; value: string; sublabel?: string; accent?: 'indigo' | 'teal' | 'default' }) {
  const accentColor = accent === 'indigo' ? 'text-indigo' : accent === 'teal' ? 'text-teal' : 'text-text'

  return (
    <Card className="p-5">
      <p className="font-mono text-[11px] uppercase tracking-wide text-text-faint">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accentColor}`}>{value}</p>
      {sublabel && <p className="mt-1 text-sm text-text-muted">{sublabel}</p>}
    </Card>
  )
}
