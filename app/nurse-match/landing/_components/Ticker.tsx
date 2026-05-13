export default function Ticker() {
  const text = (
    <>
      30 Nurses <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Nationwide <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Selected <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      <span className="font-bold text-white">Work on your own time</span>{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Cohort 4 closes May 31{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Fully sponsored tuition{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      <span className="font-bold text-white">Seats are limited and highly competitive</span>{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Apply for Selection{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Help bring treatments to communities who need them most{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>{' '}
      Elevate your nursing career — on your terms.{' '}
      <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8px' }}>·</span>
    </>
  )

  return (
    <div
      className="overflow-hidden relative z-[100] py-[9px]"
      style={{ background: 'var(--teal)' }}
    >
      <div className="ticker-track">
        {/* Duplicated for seamless loop */}
        <span
          className="font-barlow font-bold text-[11px] tracking-[.22em] uppercase px-10"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {text}
        </span>
        <span
          className="font-barlow font-bold text-[11px] tracking-[.22em] uppercase px-10"
          style={{ color: 'rgba(255,255,255,0.9)' }}
          aria-hidden
        >
          {text}
        </span>
      </div>
    </div>
  )
}
