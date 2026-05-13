'use client'

import { Search, X } from 'lucide-react'

export interface Filters {
  search: string
  status: string
  training_status: string
  license_status: string
  eligible_for_matching: string
  email_verified: string
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  status: '',
  training_status: '',
  license_status: '',
  eligible_for_matching: '',
  email_verified: '',
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  total: number
  filtered: number
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 rounded-md border text-xs font-medium pl-2 pr-6 outline-none transition-colors
        ${value
          ? 'border-blue-300 bg-blue-50 text-blue-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
        }`}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function FilterBar({ filters, onChange, total, filtered }: Props) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  const set = (key: keyof Filters) => (value: string) =>
    onChange({ ...filters, [key]: value })

  const clear = () => onChange(DEFAULT_FILTERS)

  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Name or email…"
          value={filters.search}
          onChange={(e) => set('search')(e.target.value)}
          className="h-8 pl-7 pr-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700
                     placeholder:text-slate-400 outline-none focus:border-blue-300 transition-colors w-44"
        />
      </div>

      <div className="w-px h-5 bg-slate-200" />

      <Select
        label="App Status"
        value={filters.status}
        onChange={set('status')}
        options={[
          { value: 'pending',    label: 'Pending' },
          { value: 'reviewing',  label: 'Reviewing' },
          { value: 'selected',   label: 'Selected' },
          { value: 'waitlisted', label: 'Waitlisted' },
          { value: 'rejected',   label: 'Rejected' },
        ]}
      />

      <Select
        label="Training"
        value={filters.training_status}
        onChange={set('training_status')}
        options={[
          { value: 'not_invited', label: 'Not Invited' },
          { value: 'invited',     label: 'Invited' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed',   label: 'Completed' },
          { value: 'failed',      label: 'Failed' },
          { value: 'waived',      label: 'Waived' },
        ]}
      />

      <Select
        label="License"
        value={filters.license_status}
        onChange={set('license_status')}
        options={[
          { value: 'not_started', label: 'Not Started' },
          { value: 'pending',     label: 'Pending' },
          { value: 'verified',    label: 'Verified' },
          { value: 'failed',      label: 'Failed' },
          { value: 'expired',     label: 'Expired' },
          { value: 'waived',      label: 'Waived' },
        ]}
      />

      <Select
        label="Eligible"
        value={filters.eligible_for_matching}
        onChange={set('eligible_for_matching')}
        options={[
          { value: 'true',  label: 'Eligible ✓' },
          { value: 'false', label: 'Not Eligible' },
        ]}
      />

      <Select
        label="Email"
        value={filters.email_verified}
        onChange={set('email_verified')}
        options={[
          { value: 'true',  label: 'Verified' },
          { value: 'false', label: 'Unverified' },
        ]}
      />

      {hasActiveFilters && (
        <button
          onClick={clear}
          className="flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium
                     text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
        >
          <X size={12} /> Clear
        </button>
      )}

      <div className="ml-auto text-xs text-slate-400 font-medium">
        {filtered === total
          ? `${total} nurses`
          : `${filtered} / ${total} nurses`}
      </div>
    </div>
  )
}

export { DEFAULT_FILTERS }
