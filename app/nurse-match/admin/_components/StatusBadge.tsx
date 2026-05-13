'use client'

const CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  // Application status
  pending:     { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
  reviewing:   { label: 'Reviewing',   bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  selected:    { label: 'Selected',    bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-500' },
  waitlisted:  { label: 'Waitlisted',  bg: 'bg-slate-100',  text: 'text-slate-500',  dot: 'bg-slate-400' },
  // Training
  not_invited: { label: 'Not Invited', bg: 'bg-slate-100',  text: 'text-slate-400',  dot: 'bg-slate-300' },
  invited:     { label: 'Invited',     bg: 'bg-violet-50',  text: 'text-violet-700', dot: 'bg-violet-500' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-600',   dot: 'bg-blue-400' },
  completed:   { label: 'Completed',   bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  failed:      { label: 'Failed',      bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-500' },
  waived:      { label: 'Waived',      bg: 'bg-slate-100',  text: 'text-slate-500',  dot: 'bg-slate-400' },
  // License
  not_started: { label: 'Not Started', bg: 'bg-slate-100',  text: 'text-slate-400',  dot: 'bg-slate-300' },
  verified:    { label: 'Verified',    bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  expired:     { label: 'Expired',     bg: 'bg-orange-50',  text: 'text-orange-600', dot: 'bg-orange-400' },
}

export function StatusBadge({ value, size = 'sm' }: { value: string; size?: 'xs' | 'sm' }) {
  const cfg = CONFIG[value] ?? { label: value, bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-300' }
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded font-medium ${padding} ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
