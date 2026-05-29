/* =========================================================
   ACHIEVE Landing — Static Configuration
   All editable content in one place
   ========================================================= */

export const COHORT = {
  name: 'Cohort 4',
  seats: 30,
  closeDate: new Date('2026-07-31T23:59:59'),
  tuitionValue: '$3,000',
  certName: 'Research-Ready Nurse™',
  applyUrl: '/nurse-match/apply',
}

export const STATS = [
  { value: '30',      label: 'Sponsored Seats Nationwide' },
  { value: '$3K',     label: 'Covered for Selected Nurses' },
  { value: 'Virtual', label: 'Training — Your Own Time' },
]

export const PROOF_BAR = [
  { value: '$3,000',      label: 'Covered for First 30 Selected' },
  { value: 'NIH SBIR',   label: 'Aligned Program' },
  { value: 'Virtual',    label: 'Training — Own Schedule' },
  { value: 'Sponsor & DCT', label: 'Ecosystem Partners' },
]

export const AUTONOMY_PILLS = [
  { icon: '⏱', label: 'Work on your own time' },
  { icon: '📍', label: 'Choose when you engage' },
  { icon: '✦',  label: 'Step in on your terms' },
]

export const QUOTES = [
  {
    quote: '"It was the best thing I could have done for my career. I finally felt like my skills were being used at their full potential."',
    author: 'RN, Clinical Research Transition',
  },
  {
    quote: '"Working on something that could potentially change the future of standard care is rewarding."',
    author: 'RN, Decentralized Trials',
  },
  {
    quote: '"It\'s a very nice way to be able to see the outcomes and improve patient lives."',
    author: 'Research Nurse',
  },
]

export const AUTONOMY_CONTROLS = [
  {
    icon: '⏱',
    title: 'Work on Your Own Time',
    desc: 'Training is entirely virtual and self-paced. You set the schedule. No set class times. No commute. No disruption to your current role.',
  },
  {
    icon: '🎯',
    title: 'Choose When You Participate',
    desc: 'Project-based clinical trial opportunities are flexible and engagement-based. You decide what fits your life.',
  },
  {
    icon: '✦',
    title: 'Step In on Your Terms',
    desc: "This doesn't require leaving nursing. It adds a new dimension to what you already do — on your timeline, at your pace.",
  },
  {
    icon: '💡',
    title: 'Decide How This Fits Your Life',
    desc: 'You are in control of how deeply you engage. This is not a second job. It is a pathway you open, on your terms.',
  },
]

export const BENEFITS = [
  {
    icon: '🎓',
    title: 'Fully Sponsored Certification',
    desc: 'The Research-Ready Nurse™ certification — a $3,000 professional training value — at $0 cost for the first 30 selected nurses.',
  },
  {
    icon: '🔬',
    title: 'Help Bring Treatments to Your Community',
    desc: 'Training in how care is moving beyond hospitals — into communities, homes, and real-world settings. This is where nursing is going.',
  },
  {
    icon: '💰',
    title: 'Paid Opportunities — On Your Schedule',
    desc: 'Certified nurses become eligible for paid, project-based clinical research opportunities — a new income stream, on your terms, without leaving your current role.',
  },
  {
    icon: '🌐',
    title: 'From Bedside Care — to Shaping Treatment',
    desc: 'You already care for patients. Now you can help shape the treatments they will receive next. A new professional layer, built on what you already do.',
  },
]

export const WHO_QUALIFIES = [
  { label: 'Bedside RN', desc: 'ICU, oncology, community, home health, or infusion experience' },
  { label: 'Ready to expand', desc: 'beyond traditional bedside roles without leaving nursing' },
  { label: 'Detail-oriented', desc: 'research demands precision, documentation, and protocol discipline' },
  { label: 'Community-connected', desc: 'underserved and rural communities are priority areas' },
  { label: 'Bilingual nurses', desc: 'receive priority in specific cohort allocations' },
  { label: 'No prior research experience required', desc: 'training provides everything you need' },
]

export const PRIORITY_AREAS = [
  { name: "Prince George's", pct: 88, status: 'Priority Review', color: 'gold' as const },
  { name: 'Baltimore City',  pct: 76, status: 'Priority Review', color: 'gold' as const },
  { name: 'Baltimore Co.',   pct: 55, status: 'Seats Available', color: 'teal' as const },
  { name: 'Eastern Shore',   pct: 42, status: 'Seats Available', color: 'teal' as const },
  { name: 'Montgomery Co.',  pct: 100, status: 'Filling Fast',   color: 'red' as const },
  { name: 'Anne Arundel',    pct: 94, status: 'Filling Fast',    color: 'red' as const },
]

export const STEPS = [
  { num: '1', title: 'Apply',       desc: 'Share specialty, location & availability.', tag: '3 minutes' },
  { num: '2', title: 'Get Selected', desc: 'Matched by region, specialty & community need.', tag: 'Rolling review' },
  { num: '3', title: 'Train',        desc: 'Virtual, self-paced — your schedule, your pace.', tag: 'Fully virtual' },
  { num: '4', title: 'Certify',      desc: 'Earn your Research-Ready Nurse™ Certificate.', tag: '$3,000 value' },
  { num: '5', title: 'Engage',       desc: 'Step into flexible, project-based research opportunities.', tag: 'On your terms' },
]

export const BOTTOM_REASSURANCES = [
  'First 30: Sponsored Tuition',
  'Virtual Training — Your Schedule',
  '10 Hours · Self-Paced',
  'NIH SBIR-Aligned',
]

// Apply form options
export const ROLES = [
  'Registered Nurse (RN)',
  'BSN, RN',
  'MSN, RN',
  'Nurse Practitioner (NP)',
  'Other Clinical Role',
]

export const SPECIALTIES = [
  'ICU / Critical Care',
  'Oncology',
  'Community Health',
  'Home Health',
  'Infusion',
  'Emergency / Trauma',
  'Pediatrics',
  'Med-Surg',
  'Primary Care',
  'Other',
]

export const SPECIAL_EXPERIENCE_OPTIONS = [
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'port',       label: 'Port' },
]

export const EXPERIENCE_OPTIONS = [
  'Less than 2 years',
  '2–5 years',
  '5–10 years',
  '10–15 years',
  '15+ years',
]

export const GOAL_OPTIONS = [
  { value: 'income',      label: 'Additional Income',  desc: 'Supplement earnings on my own schedule' },
  { value: 'flexibility', label: 'More Flexibility',   desc: 'Work beyond rigid bedside shifts' },
  { value: 'impact',      label: 'Greater Impact',     desc: 'Help bring research closer to patients' },
  { value: 'career',      label: 'Career Elevation',   desc: 'Expand my professional trajectory' },
  { value: 'all',         label: 'All of the above',   desc: '' },
]

export const HOURS_OPTIONS = [
  { value: '5-10',   label: '5–10 hrs/month',  desc: 'Light engagement' },
  { value: '10-20',  label: '10–20 hrs/month', desc: 'Moderate engagement' },
  { value: '20+',    label: '20+ hrs/month',   desc: 'Deep engagement' },
  { value: 'unsure', label: 'Not sure yet',    desc: "I'd like to learn more first" },
]

export const LANGUAGE_OPTIONS = [
  'Spanish',
  'Mandarin',
  'Cantonese',
  'French',
  'Portuguese',
  'Tagalog',
  'Vietnamese',
  'Korean',
  'Arabic',
  'Hindi',
  'Russian',
  'Haitian Creole',
  'Japanese',
  'Italian',
  'German',
  'Other',
]

export const SOURCE_OPTIONS = [
  'Social media',
  'Colleague referral',
  'Email',
  'Professional organization',
  'Online search',
  'Other',
]

export const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]
