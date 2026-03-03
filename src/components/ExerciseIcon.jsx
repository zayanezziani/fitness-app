import { CATEGORIES, getExercise } from '../data/exercises.js'

// ── SVG pictograms ──────────────────────────────────────────────────────────
// All icons use stroke="currentColor", no fills, 24×24 viewBox

const icons = {
  barbell: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      <rect x="1"  y="9.5" width="3" height="5" rx="1" fill="currentColor" stroke="none"/>
      <rect x="20" y="9.5" width="3" height="5" rx="1" fill="currentColor" stroke="none"/>
      <rect x="3.5" y="10.5" width="2" height="3" rx="0.5" fill="currentColor" stroke="none"/>
      <rect x="18.5" y="10.5" width="2" height="3" rx="0.5" fill="currentColor" stroke="none"/>
      <line x1="5.5" y1="12" x2="18.5" y2="12" strokeWidth="2"/>
    </svg>
  ),

  dumbbell: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" stroke="currentColor">
      <rect x="1"  y="9" width="5" height="6" rx="1.5" fill="currentColor" stroke="none"/>
      <rect x="18" y="9" width="5" height="6" rx="1.5" fill="currentColor" stroke="none"/>
      <line x1="6" y1="12" x2="18" y2="12" strokeWidth="2.5"/>
    </svg>
  ),

  pullup: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* bar */}
      <line x1="2" y1="3" x2="22" y2="3" strokeWidth="2.2"/>
      {/* head */}
      <circle cx="12" cy="9.5" r="2.5" fill="currentColor" stroke="none"/>
      {/* arms */}
      <line x1="9.5" y1="7.5" x2="7"  y2="3"/>
      <line x1="14.5" y1="7.5" x2="17" y2="3"/>
      {/* torso */}
      <line x1="12" y1="12" x2="12" y2="18"/>
      {/* legs */}
      <line x1="12" y1="18" x2="9"  y2="22"/>
      <line x1="12" y1="18" x2="15" y2="22"/>
    </svg>
  ),

  deadlift: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* barbell on floor */}
      <rect x="1"  y="18" width="2.5" height="5" rx="0.8" fill="currentColor" stroke="none"/>
      <rect x="20.5" y="18" width="2.5" height="5" rx="0.8" fill="currentColor" stroke="none"/>
      <line x1="3.5" y1="20.5" x2="20.5" y2="20.5" strokeWidth="2"/>
      {/* person bending: head top-left */}
      <circle cx="7" cy="5" r="2.5" fill="currentColor" stroke="none"/>
      {/* spine angled forward */}
      <line x1="7" y1="7.5" x2="16" y2="14"/>
      {/* hips down to feet */}
      <line x1="16" y1="14" x2="13" y2="21"/>
      <line x1="16" y1="14" x2="18" y2="21"/>
      {/* arms hanging to bar */}
      <line x1="10" y1="10" x2="13" y2="20.5"/>
    </svg>
  ),

  row: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* barbell */}
      <rect x="9"  y="14" width="2.5" height="5" rx="0.8" fill="currentColor" stroke="none"/>
      <rect x="14" y="14" width="2.5" height="5" rx="0.8" fill="currentColor" stroke="none"/>
      <line x1="11.5" y1="16.5" x2="14" y2="16.5" strokeWidth="1.8"/>
      {/* person bent over */}
      <circle cx="5.5" cy="5" r="2.5" fill="currentColor" stroke="none"/>
      <line x1="5.5" y1="7.5" x2="16" y2="12"/>
      {/* arm pulling up */}
      <line x1="10" y1="10" x2="12.5" y2="15.5"/>
      {/* legs */}
      <line x1="16" y1="12" x2="14" y2="21"/>
      <line x1="16" y1="12" x2="18" y2="21"/>
    </svg>
  ),

  squat: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* barbell across shoulders */}
      <line x1="5" y1="7" x2="19" y2="7" strokeWidth="2"/>
      <rect x="3"  y="5" width="2" height="4" rx="0.6" fill="currentColor" stroke="none"/>
      <rect x="19" y="5" width="2" height="4" rx="0.6" fill="currentColor" stroke="none"/>
      {/* head */}
      <circle cx="12" cy="3.5" r="2" fill="currentColor" stroke="none"/>
      {/* torso (slight forward lean) */}
      <line x1="12" y1="7" x2="11" y2="13"/>
      {/* left leg: thigh + shin in squat */}
      <line x1="11" y1="13" x2="7"  y2="16"/>
      <line x1="7"  y1="16" x2="7"  y2="22"/>
      {/* right leg */}
      <line x1="11" y1="13" x2="15" y2="16"/>
      <line x1="15" y1="16" x2="15" y2="22"/>
    </svg>
  ),

  ohp: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* barbell overhead */}
      <line x1="4" y1="3" x2="20" y2="3" strokeWidth="2"/>
      <rect x="2"  y="1.5" width="2" height="3" rx="0.6" fill="currentColor" stroke="none"/>
      <rect x="20" y="1.5" width="2" height="3" rx="0.6" fill="currentColor" stroke="none"/>
      {/* head */}
      <circle cx="12" cy="8" r="2.5" fill="currentColor" stroke="none"/>
      {/* arms up */}
      <line x1="9.5" y1="6.5" x2="6" y2="3"/>
      <line x1="14.5" y1="6.5" x2="18" y2="3"/>
      {/* torso */}
      <line x1="12" y1="10.5" x2="12" y2="17"/>
      {/* legs */}
      <line x1="12" y1="17" x2="9"  y2="22"/>
      <line x1="12" y1="17" x2="15" y2="22"/>
    </svg>
  ),

  lateral: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* head */}
      <circle cx="12" cy="4" r="2.5" fill="currentColor" stroke="none"/>
      {/* torso */}
      <line x1="12" y1="6.5" x2="12" y2="15"/>
      {/* arms out to sides (lateral raise position) */}
      <line x1="12" y1="9"  x2="3"  y2="10.5"/>
      <line x1="12" y1="9"  x2="21" y2="10.5"/>
      {/* dumbbells at ends */}
      <rect x="0.5" y="9.5"  width="2.5" height="2" rx="0.5" fill="currentColor" stroke="none"/>
      <rect x="21"  y="9.5"  width="2.5" height="2" rx="0.5" fill="currentColor" stroke="none"/>
      {/* legs */}
      <line x1="12" y1="15" x2="9"  y2="22"/>
      <line x1="12" y1="15" x2="15" y2="22"/>
    </svg>
  ),

  curl: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* head */}
      <circle cx="10" cy="4" r="2.5" fill="currentColor" stroke="none"/>
      {/* torso */}
      <line x1="10" y1="6.5" x2="10" y2="15"/>
      {/* upper arm (hanging) */}
      <line x1="10" y1="8.5" x2="10" y2="15"/>
      {/* forearm (bent up — curl position) */}
      <line x1="10" y1="15" x2="17" y2="10"/>
      {/* dumbbell */}
      <rect x="17" y="8" width="5" height="3.5" rx="1" fill="currentColor" stroke="none"/>
      {/* other arm (straight down) */}
      <line x1="10" y1="8.5" x2="6" y2="14"/>
      {/* legs */}
      <line x1="10" y1="15" x2="7"  y2="22"/>
      <line x1="10" y1="15" x2="13" y2="22"/>
    </svg>
  ),

  dip: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* parallel bars */}
      <line x1="4"  y1="8" x2="4"  y2="2"/>
      <line x1="20" y1="8" x2="20" y2="2"/>
      <line x1="2"  y1="2" x2="6"  y2="2" strokeWidth="2"/>
      <line x1="18" y1="2" x2="22" y2="2" strokeWidth="2"/>
      {/* head */}
      <circle cx="12" cy="5.5" r="2.5" fill="currentColor" stroke="none"/>
      {/* torso */}
      <line x1="12" y1="8" x2="12" y2="14"/>
      {/* arms on bars */}
      <line x1="12" y1="10" x2="4" y2="10"/>
      <line x1="12" y1="10" x2="20" y2="10"/>
      {/* legs bent down */}
      <line x1="12" y1="14" x2="9"  y2="19"/>
      <line x1="12" y1="14" x2="15" y2="19"/>
      <line x1="9"  y1="19" x2="11" y2="23"/>
      <line x1="15" y1="19" x2="13" y2="23"/>
    </svg>
  ),

  plank: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* head */}
      <circle cx="4" cy="10.5" r="2.5" fill="currentColor" stroke="none"/>
      {/* body (horizontal, slightly angled) */}
      <line x1="6" y1="11.5" x2="21" y2="13.5"/>
      {/* arms straight down */}
      <line x1="8.5"  y1="11.8" x2="8.5"  y2="16"/>
      <line x1="14" y1="12.5" x2="14" y2="16"/>
      {/* floor */}
      <line x1="6" y1="16" x2="22" y2="16" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
    </svg>
  ),

  crunch: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* floor */}
      <line x1="1" y1="22" x2="23" y2="22" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
      {/* legs on floor */}
      <line x1="9"  y1="18" x2="4"  y2="22"/>
      <line x1="14" y1="18" x2="19" y2="22"/>
      {/* hips */}
      <line x1="9" y1="18" x2="14" y2="18"/>
      {/* torso curled up */}
      <path d="M 11.5 18 Q 9 12 13 8" strokeWidth="1.6"/>
      {/* head */}
      <circle cx="14.5" cy="6" r="2.5" fill="currentColor" stroke="none"/>
    </svg>
  ),

  lunge: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* head */}
      <circle cx="10" cy="4" r="2.5" fill="currentColor" stroke="none"/>
      {/* torso (upright) */}
      <line x1="10" y1="6.5" x2="10" y2="13"/>
      {/* front leg: knee forward, shin down */}
      <line x1="10" y1="13" x2="16" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="22"/>
      {/* back leg: knee down behind */}
      <line x1="10" y1="13" x2="7" y2="17"/>
      <line x1="7"  y1="17" x2="4" y2="22"/>
      {/* arms natural at sides */}
      <line x1="10" y1="9" x2="7"  y2="14"/>
      <line x1="10" y1="9" x2="13" y2="13"/>
    </svg>
  ),

  legpress: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* seat */}
      <rect x="1" y="14" width="8" height="3" rx="1" fill="currentColor" stroke="none"/>
      {/* person reclined */}
      <circle cx="4" cy="11" r="2.5" fill="currentColor" stroke="none"/>
      <line x1="4" y1="13.5" x2="8" y2="14"/>
      {/* legs pressing plate diagonally */}
      <line x1="8"  y1="14" x2="17" y2="7"/>
      <line x1="8"  y1="14" x2="19" y2="5"/>
      {/* plate */}
      <rect x="18" y="2" width="3" height="8" rx="1" fill="currentColor" stroke="none"/>
    </svg>
  ),

  calfrise: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* head */}
      <circle cx="12" cy="3" r="2.5" fill="currentColor" stroke="none"/>
      {/* torso */}
      <line x1="12" y1="5.5" x2="12" y2="14"/>
      {/* arms holding dumbbell */}
      <line x1="12" y1="9" x2="8" y2="11"/>
      <line x1="12" y1="9" x2="16" y2="11"/>
      {/* legs */}
      <line x1="12" y1="14" x2="10" y2="19"/>
      <line x1="12" y1="14" x2="14" y2="19"/>
      {/* feet raised on toes (calf raise!) */}
      <line x1="10" y1="19" x2="8"  y2="22"/>
      <line x1="14" y1="19" x2="12" y2="22"/>
      {/* elevation platform */}
      <line x1="6" y1="22" x2="16" y2="22" strokeWidth="2"/>
    </svg>
  ),

  cable: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
      {/* cable machine pulley */}
      <circle cx="20" cy="4" r="2" fill="none" strokeWidth="1.6"/>
      {/* cable running down and to person */}
      <line x1="20" y1="6" x2="20" y2="12"/>
      <line x1="20" y1="12" x2="14" y2="14"/>
      {/* handle */}
      <rect x="12" y="13" width="3" height="2.5" rx="0.8" fill="currentColor" stroke="none"/>
      {/* person */}
      <circle cx="8" cy="6" r="2.5" fill="currentColor" stroke="none"/>
      <line x1="8" y1="8.5" x2="8" y2="16"/>
      <line x1="8" y1="11" x2="12" y2="13.5"/>
      <line x1="8" y1="16" x2="5" y2="22"/>
      <line x1="8" y1="16" x2="11" y2="22"/>
    </svg>
  ),
}

// Fallback: generic dumbbell icon
const FallbackIcon = icons.dumbbell

// ── Component ────────────────────────────────────────────────────────────────

const SIZES = {
  sm:  { box: 'w-9 h-9  rounded-xl',   svg: 'w-4 h-4' },
  md:  { box: 'w-12 h-12 rounded-2xl', svg: 'w-6 h-6' },
  lg:  { box: 'w-16 h-16 rounded-2xl', svg: 'w-8 h-8' },
  xl:  { box: 'w-20 h-20 rounded-3xl', svg: 'w-10 h-10' },
}

export function ExerciseIcon({ exerciseId, size = 'md', className = '' }) {
  const exercise = getExercise(exerciseId)
  const cat  = CATEGORIES[exercise?.category] ?? CATEGORIES.chest
  const Icon = exercise ? (icons[exercise.icon] ?? FallbackIcon) : FallbackIcon
  const { box, svg } = SIZES[size] ?? SIZES.md

  return (
    <div
      className={`${box} flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: cat.bg, color: cat.color }}
    >
      <div className={svg}>
        <Icon />
      </div>
    </div>
  )
}
