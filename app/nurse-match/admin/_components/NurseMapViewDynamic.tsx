'use client'

import dynamic from 'next/dynamic'

export const NurseMapViewDynamic = dynamic(
  () => import('./NurseMapView').then((m) => ({ default: m.NurseMapView })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading map…</div> }
)
