'use client'
import { useState } from 'react'

const FAQ_LEFT = [
  { q: 'Who is eligible to apply?', a: 'Active U.S.-based RNs and NPs are welcome to apply. Nurses from all backgrounds — including bedside, community health, home health, infusion, oncology, ICU, med-surg, and public health — are encouraged to apply. No prior research experience is required.' },
  { q: 'Is this a job?', a: 'No. This is a sponsored training program that certifies you and makes you eligible for paid, project-based clinical research opportunities. You decide when and how often you participate based on your availability.' },
  { q: 'Are there paid opportunities?', a: 'Yes. Once certified, you become eligible for paid local research opportunities. Opportunities vary by geography, specialty, and study availability. You are matched to nearby opportunities — no searching required.' },
  { q: 'Can I be contacted for local or nearby opportunities?', a: 'Yes. Once you complete the program and earn your Research-Ready Nurse™ certificate, you can be matched directly to nearby research opportunities in your community.' },
  { q: 'Do I have to leave my current job?', a: 'No. The program is designed to fit around your existing nursing role. Training is virtual, self-paced, and asynchronous. Research opportunities are project-based and flexible.' },
]

const FAQ_RIGHT = [
  { q: 'Do I need prior research experience?', a: 'No prior research experience is required. Nurses with or without research experience may apply. Selection is based on clinical background, readiness, geography, specialty, availability, and alignment with study needs.' },
  { q: 'Is the $3,000 tuition really covered?', a: 'Yes. For the first 30 selected nurses, tuition is fully covered — a $3,000 value. There is no cost to apply or to complete the program if selected for a sponsored seat.' },
  { q: 'How are nurses selected?', a: 'Selection is based on specialty, geography, availability, language skills, readiness, and alignment with current or future clinical research needs. Applications are reviewed on a rolling basis — early applicants receive priority consideration.' },
  { q: 'What if I don’t get one of the sponsored seats?', a: 'You are still in the pipeline. Every nurse who applies is automatically considered for current and future funded cohorts — no need to reapply. As new cohorts open, qualified nurses may be invited into fully funded scholarship spots.' },
  { q: 'How long does the training take?', a: 'Training is 8–10 hours total, delivered virtually and asynchronously. You complete it on your own schedule — no set class times, no live sessions required.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#e8eef2]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-transparent border-none py-4 text-[14px] font-semibold text-[#0d2a3f] cursor-pointer flex justify-between items-center gap-3"
      >
        {q}
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-all duration-200 ${
            open ? 'bg-[#1a6b7a] text-white rotate-180' : 'bg-[#e8eef2] text-[#0d2a3f]'
          }`}
        >&#9660;</span>
      </button>
      {open && (
        <div className="text-[13px] text-[#6b7c8d] leading-[1.7] pb-4">{a}</div>
      )}
    </div>
  )
}

export default function StepsSection() {
  return (
    <section className="py-[60px] px-6 bg-[#f7f9fb]">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.5rem,3vw,2rem)] text-[#0d2a3f] text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-2 gap-x-10">
          <div>{FAQ_LEFT.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}</div>
          <div>{FAQ_RIGHT.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}</div>
        </div>
      </div>
    </section>
  )
}
