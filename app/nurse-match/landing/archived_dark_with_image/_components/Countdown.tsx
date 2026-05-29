'use client'

import { useEffect, useState } from 'react'
import { COHORT } from '../../../_config'

interface CountdownProps {
  size?: 'lg' | 'sm'
  /** element IDs used for server-rendered placeholders (legacy compat) */
}

function calcDiff(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: '00', hours: '00', mins: '00', secs: '00' }
  return {
    days:  String(Math.floor(diff / 864e5)).padStart(2, '0'),
    hours: String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0'),
    mins:  String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0'),
    secs:  String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0'),
  }
}

export default function Countdown({ size = 'lg' }: CountdownProps) {
  const [t, setT] = useState(calcDiff(COHORT.closeDate))

  useEffect(() => {
    const id = setInterval(() => setT(calcDiff(COHORT.closeDate)), 1000)
    return () => clearInterval(id)
  }, [])

  if (size === 'sm') {
    return (
      <div className="flex gap-2">
        {(['days', 'hours', 'mins', 'secs'] as const).map((k, i) => (
          <div key={k} className="flex items-center gap-2">
            {i > 0 && (
              <span className="font-cormorant text-[24px] font-light" style={{ color: 'var(--gold)' }}>:</span>
            )}
            <div className="text-center">
              <span
                className="font-cormorant text-[28px] font-bold block leading-none w-[42px] border-b"
                style={{ color: 'var(--gold-bright)', borderColor: 'rgba(232,168,32,0.2)' }}
              >
                {t[k]}
              </span>
              <span className="block mt-1 font-barlow text-[8px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--muted)' }}>
                {k === 'mins' ? 'Min' : k.charAt(0).toUpperCase() + k.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const labels = { days: 'Days', hours: 'Hrs', mins: 'Min', secs: 'Sec' }

  return (
    <div className="flex justify-center gap-2">
      {(['days', 'hours', 'mins', 'secs'] as const).map((k, i) => (
        <div key={k} className="flex items-center gap-2">
          {i > 0 && (
            <span className="font-cormorant text-[28px] font-light mt-[-4px]"
              style={{ color: 'var(--gold)' }}>:</span>
          )}
          <div className="text-center">
            <span
              id={k}
              className="font-cormorant text-[34px] font-bold block leading-none w-[52px] border-b"
              style={{ color: 'var(--gold-bright)', borderColor: 'rgba(232,168,32,0.2)' }}
            >
              {t[k]}
            </span>
            <span className="block mt-1 font-barlow text-[9px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--muted)' }}>
              {labels[k]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
