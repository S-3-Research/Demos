'use client'

import { ChevronRight, Mail, MapPin, CheckCircle2, XCircle } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import type { NurseApplication } from './types'

interface Props {
  nurses: NurseApplication[]
  selectedId: string | null
  onSelect: (n: NurseApplication) => void
}

function fmt(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function NurseTable({ nurses, selectedId, onSelect }: Props) {
  if (nurses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20 text-slate-400">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm font-medium">No nurses match the current filters</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Nurse
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              App Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Training
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              License
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Eligible
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Applied
            </th>
            <th className="px-4 py-3 w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {nurses.map((nurse) => {
            const isSelected = nurse.id === selectedId
            return (
              <tr
                key={nurse.id}
                onClick={() => onSelect(nurse)}
                className={`cursor-pointer transition-colors group
                  ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50/80'}`}
              >
                {/* Nurse info */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center
                                    text-xs font-bold text-slate-600 shrink-0">
                      {nurse.first_name[0]}{nurse.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {nurse.first_name} {nurse.last_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Mail size={10} />
                          {nurse.email}
                        </span>
                        {nurse.email_verified
                          ? <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                          : <XCircle size={11} className="text-slate-300 shrink-0" />
                        }
                      </div>
                      {(nurse.city || nurse.state) && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin size={10} />
                          {[nurse.city, nurse.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* App status */}
                <td className="px-4 py-3.5">
                  <StatusBadge value={nurse.status} />
                </td>

                {/* Training */}
                <td className="px-4 py-3.5">
                  <StatusBadge value={nurse.training_status} />
                </td>

                {/* License */}
                <td className="px-4 py-3.5">
                  <StatusBadge value={nurse.license_verification_status} />
                </td>

                {/* Eligible */}
                <td className="px-4 py-3.5">
                  {nurse.eligible_for_matching ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 size={13} /> Yes
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 font-medium">—</span>
                  )}
                </td>

                {/* Applied */}
                <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                  {fmt(nurse.applied_at)}
                </td>

                {/* Arrow */}
                <td className="px-4 py-3.5">
                  <ChevronRight
                    size={14}
                    className={`transition-colors ${isSelected ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-400'}`}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
