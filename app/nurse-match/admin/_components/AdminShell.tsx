'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Zap, Users, RefreshCw, Table2, Map, MapPin } from 'lucide-react'
import { FilterBar, DEFAULT_FILTERS, type Filters } from './FilterBar'
import { NurseTable } from './NurseTable'
import { NurseDrawer } from './NurseDrawer'
import { NurseMapViewDynamic } from './NurseMapViewDynamic'
import type { NurseApplication } from './types'

type ViewMode = 'table' | 'map'

interface Props {
  initialNurses: NurseApplication[]
}

export function AdminShell({ initialNurses }: Props) {
  const [nurses, setNurses] = useState<NurseApplication[]>(initialNurses)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [geocoding, setGeocoding] = useState(false)

  // Client-side filtering
  const filtered = useMemo(() => {
    return nurses.filter((n) => {
      if (filters.status              && n.status !== filters.status) return false
      if (filters.training_status     && n.training_status !== filters.training_status) return false
      if (filters.license_status      && n.license_verification_status !== filters.license_status) return false
      if (filters.eligible_for_matching) {
        const want = filters.eligible_for_matching === 'true'
        if (n.eligible_for_matching !== want) return false
      }
      if (filters.email_verified) {
        const want = filters.email_verified === 'true'
        if (n.email_verified !== want) return false
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const full = `${n.first_name} ${n.last_name} ${n.email}`.toLowerCase()
        if (!full.includes(q)) return false
      }
      return true
    })
  }, [nurses, filters])

  const selectedNurse = nurses.find((n) => n.id === selectedId) ?? null

  const handleUpdate = (updated: NurseApplication) => {
    setNurses((prev) => prev.map((n) => n.id === updated.id ? updated : n))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/nurse-match/admin/nurses')
      const data = await res.json()
      if (data.nurses) setNurses(data.nurses)
    } catch (e) {
      console.error('[AdminShell] refresh error:', e)
    } finally {
      setRefreshing(false)
    }
  }

  const handleGeocode = async () => {
    setGeocoding(true)
    try {
      const res = await fetch('/api/nurse-match/admin/geocode-nurses', { method: 'POST' })
      const data = await res.json()
      console.log('[AdminShell] geocode result:', data)
      // Refresh to get updated coordinates
      await handleRefresh()
    } catch (e) {
      console.error('[AdminShell] geocode error:', e)
    } finally {
      setGeocoding(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-slate-900 select-none overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-slate-100 px-6 flex items-center justify-between bg-white z-50 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/nurse-match" className="flex items-center gap-2.5 group">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="text-base font-bold text-slate-800">
              Nurse<span className="text-blue-600">Match</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-white shadow-sm text-blue-600">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Users size={14} />
            <span className="text-xs font-medium">{nurses.length} nurses total</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Table2 size={13} />
              Table
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Map size={13} />
              Map
            </button>
          </div>

          {/* Geocode button — only visible in map mode */}
          {viewMode === 'map' && (
            <button
              onClick={handleGeocode}
              disabled={geocoding}
              title="Geocode nurses without coordinates"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-slate-500
                         hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <MapPin size={13} className={geocoding ? 'animate-pulse' : ''} />
              {geocoding ? 'Geocoding…' : 'Geocode All'}
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-slate-500
                       hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      {/* Filter bar — only shown in table mode (map has its own built-in filter bar) */}
      {viewMode === 'table' && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
          total={nurses.length}
          filtered={filtered.length}
        />
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'table' ? (
          <>
            {/* Table */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <NurseTable
                nurses={filtered}
                selectedId={selectedId}
                onSelect={(n) => setSelectedId(n.id === selectedId ? null : n.id)}
              />
            </div>

            {/* Drawer */}
            {selectedNurse && (
              <NurseDrawer
                key={selectedNurse.id}
                nurse={selectedNurse}
                onClose={() => setSelectedId(null)}
                onUpdate={handleUpdate}
              />
            )}
          </>
        ) : (
          <NurseMapViewDynamic
            nurses={filtered}
            allNurses={nurses}
            filters={filters}
            onFiltersChange={setFilters}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>
    </div>
  )
}
