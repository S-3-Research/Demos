'use client'

import { useEffect, useRef } from 'react'
import MapGL, { Marker, NavigationControl, useMap } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin } from 'lucide-react'
import { FilterBar, type Filters } from './FilterBar'
import { StatusBadge } from './StatusBadge'
import type { NurseApplication } from './types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

interface Props {
  nurses: NurseApplication[]
  allNurses: NurseApplication[]
  filters: Filters
  onFiltersChange: (f: Filters) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
}

function initials(n: NurseApplication) {
  return `${n.first_name?.[0] ?? ''}${n.last_name?.[0] ?? ''}`.toUpperCase()
}

function FlyToController({ selectedNurse }: { selectedNurse: NurseApplication | null }) {
  const { current: map } = useMap()
  useEffect(() => {
    if (!map || !selectedNurse || selectedNurse.latitude == null || selectedNurse.longitude == null) return
    map.flyTo({ center: [selectedNurse.longitude, selectedNurse.latitude], zoom: 10, speed: 1.4, curve: 1.2 })
  }, [map, selectedNurse?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export function NurseMapView({ nurses, allNurses, filters, onFiltersChange, selectedId, onSelect }: Props) {
  const listRefs = useRef(new globalThis.Map<string, HTMLDivElement>())
  const nursesWithCoords = nurses.filter((n) => n.latitude != null && n.longitude != null)
  const nursesWithoutCoords = nurses.filter((n) => n.latitude == null || n.longitude == null)
  const selectedNurse = nurses.find((n) => n.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId) return
    const el = listRefs.current.get(selectedId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Filter + List */}
      <div className="w-[35%] flex flex-col overflow-hidden border-r border-slate-100 shrink-0">
        <FilterBar filters={filters} onChange={onFiltersChange} total={allNurses.length} filtered={nurses.length} />

        {nursesWithoutCoords.length > 0 && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-1.5 shrink-0">
            <MapPin size={12} />
            {nursesWithoutCoords.length} nurse{nursesWithoutCoords.length > 1 ? 's' : ''} without location — use &quot;Geocode All&quot;
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1.5">
          {nurses.map((nurse) => {
            const isSelected = nurse.id === selectedId
            const hasCoords = nurse.latitude != null && nurse.longitude != null
            return (
              <div
                key={nurse.id}
                ref={(el) => { if (el) listRefs.current.set(nurse.id, el) }}
                onClick={() => onSelect(nurse.id === selectedId ? null : nurse.id)}
                className={[
                  'rounded-lg p-3 cursor-pointer border transition-all duration-150',
                  isSelected ? 'bg-orange-50 border-orange-300 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50',
                ].join(' ')}
              >
                <div className="flex items-start gap-2.5">
                  <div className={['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', isSelected ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'].join(' ')}>
                    {initials(nurse)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-800 truncate">{nurse.first_name} {nurse.last_name}</span>
                      {!hasCoords && <span title="No location data"><MapPin size={10} className="text-slate-300 shrink-0" /></span>}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {[nurse.city, nurse.state].filter(Boolean).join(', ') || nurse.email}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <StatusBadge value={nurse.status} size="xs" />
                      {nurse.eligible_for_matching && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">Eligible</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {nurses.length === 0 && <div className="text-center text-slate-400 text-xs py-12">No nurses match filters</div>}
        </div>
      </div>

      {/* Right: Map */}
      <div className="flex-1 relative">
        <MapGL
          id="nurseMap"
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{ longitude: -98.5795, latitude: 39.8283, zoom: 3.5 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          <NavigationControl position="top-right" />
          <FlyToController selectedNurse={selectedNurse} />

          {nursesWithCoords.map((nurse) => {
            const isSelected = nurse.id === selectedId
            return (
              <Marker
                key={nurse.id}
                longitude={nurse.longitude!}
                latitude={nurse.latitude!}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  onSelect(nurse.id === selectedId ? null : nurse.id)
                }}
              >
                <div
                  title={`${nurse.first_name} ${nurse.last_name}`}
                  className={[
                    'rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-150 shadow-md border-2 select-none',
                    isSelected
                      ? 'bg-orange-500 border-orange-200 text-white w-10 h-10 z-50'
                      : 'bg-blue-600 border-white text-white w-8 h-8 hover:scale-110',
                  ].join(' ')}
                >
                  {initials(nurse)}
                </div>
              </Marker>
            )
          })}
        </MapGL>
      </div>
    </div>
  )
}
