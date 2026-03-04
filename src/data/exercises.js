export const CATEGORIES = {
  chest:     { name: 'Chest',     color: '#ff2d55', bg: 'rgba(255,45,85,0.10)' },
  back:      { name: 'Back',      color: '#5856d6', bg: 'rgba(88,86,214,0.10)' },
  shoulders: { name: 'Shoulders', color: '#af52de', bg: 'rgba(175,82,222,0.10)' },
  arms:      { name: 'Arms',      color: '#ff9500', bg: 'rgba(255,149,0,0.10)' },
  legs:      { name: 'Legs',      color: '#34c759', bg: 'rgba(52,199,89,0.10)' },
  core:      { name: 'Core',      color: '#ffcc00', bg: 'rgba(255,204,0,0.12)' },
}

// icon: which SVG pictogram to display
export const EXERCISES = [
  // ── CHEST ─────────────────────────────────────────────────
  { id: 'bench-press',       name: 'Bench Press',            category: 'chest',     defaultSets: 4, defaultReps: 8,  icon: 'barbell' },
  { id: 'incline-bench',     name: 'Incline Bench Press',    category: 'chest',     defaultSets: 3, defaultReps: 10, icon: 'barbell' },
  { id: 'decline-bench',     name: 'Decline Bench Press',    category: 'chest',     defaultSets: 3, defaultReps: 10, icon: 'barbell' },
  { id: 'dumbbell-press',    name: 'Dumbbell Press',         category: 'chest',     defaultSets: 3, defaultReps: 10, icon: 'dumbbell' },
  { id: 'push-up',           name: 'Push-Up',                category: 'chest',     defaultSets: 3, defaultReps: 15, icon: 'plank' },
  { id: 'chest-fly',         name: 'Chest Fly',              category: 'chest',     defaultSets: 3, defaultReps: 12, icon: 'dumbbell' },
  { id: 'cable-crossover',   name: 'Cable Crossover',        category: 'chest',     defaultSets: 3, defaultReps: 12, icon: 'cable' },
  { id: 'pec-deck',          name: 'Pec Deck',               category: 'chest',     defaultSets: 3, defaultReps: 12, icon: 'cable' },

  // ── BACK ──────────────────────────────────────────────────
  { id: 'deadlift',          name: 'Deadlift',               category: 'back',      defaultSets: 3, defaultReps: 5,  icon: 'deadlift' },
  { id: 'pull-up',           name: 'Pull-Up',                category: 'back',      defaultSets: 3, defaultReps: 8,  icon: 'pullup' },
  { id: 'chin-up',           name: 'Chin-Up',                category: 'back',      defaultSets: 3, defaultReps: 8,  icon: 'pullup' },
  { id: 'bent-over-row',     name: 'Bent-Over Row',          category: 'back',      defaultSets: 4, defaultReps: 8,  icon: 'row' },
  { id: 'lat-pulldown',      name: 'Lat Pulldown',           category: 'back',      defaultSets: 3, defaultReps: 12, icon: 'pullup' },
  { id: 'seated-cable-row',  name: 'Seated Cable Row',       category: 'back',      defaultSets: 3, defaultReps: 12, icon: 'cable' },
  { id: 'tbar-row',          name: 'T-Bar Row',              category: 'back',      defaultSets: 3, defaultReps: 10, icon: 'barbell' },
  { id: 'face-pull',         name: 'Face Pull',              category: 'back',      defaultSets: 3, defaultReps: 15, icon: 'cable' },
  { id: 'single-arm-row',    name: 'Single-Arm Row',         category: 'back',      defaultSets: 3, defaultReps: 12, icon: 'dumbbell' },

  // ── SHOULDERS ─────────────────────────────────────────────
  { id: 'overhead-press',    name: 'Overhead Press',         category: 'shoulders', defaultSets: 4, defaultReps: 8,  icon: 'ohp' },
  { id: 'arnold-press',      name: 'Arnold Press',           category: 'shoulders', defaultSets: 3, defaultReps: 10, icon: 'ohp' },
  { id: 'lateral-raise',     name: 'Lateral Raise',          category: 'shoulders', defaultSets: 4, defaultReps: 15, icon: 'lateral' },
  { id: 'front-raise',       name: 'Front Raise',            category: 'shoulders', defaultSets: 3, defaultReps: 12, icon: 'dumbbell' },
  { id: 'rear-delt-fly',     name: 'Rear Delt Fly',          category: 'shoulders', defaultSets: 3, defaultReps: 15, icon: 'dumbbell' },
  { id: 'upright-row',       name: 'Upright Row',            category: 'shoulders', defaultSets: 3, defaultReps: 12, icon: 'barbell' },
  { id: 'shrugs',            name: 'Shrugs',                 category: 'shoulders', defaultSets: 3, defaultReps: 15, icon: 'dumbbell' },

  // ── ARMS ──────────────────────────────────────────────────
  { id: 'bicep-curl',        name: 'Bicep Curl',             category: 'arms',      defaultSets: 3, defaultReps: 12, icon: 'curl' },
  { id: 'hammer-curl',       name: 'Hammer Curl',            category: 'arms',      defaultSets: 3, defaultReps: 12, icon: 'curl' },
  { id: 'preacher-curl',     name: 'Preacher Curl',          category: 'arms',      defaultSets: 3, defaultReps: 10, icon: 'curl' },
  { id: 'concentration-curl',name: 'Concentration Curl',     category: 'arms',      defaultSets: 3, defaultReps: 12, icon: 'curl' },
  { id: 'barbell-curl',      name: 'Barbell Curl',           category: 'arms',      defaultSets: 3, defaultReps: 10, icon: 'barbell' },
  { id: 'tricep-dip',        name: 'Tricep Dip',             category: 'arms',      defaultSets: 3, defaultReps: 10, icon: 'dip' },
  { id: 'skull-crusher',     name: 'Skull Crusher',          category: 'arms',      defaultSets: 3, defaultReps: 10, icon: 'barbell' },
  { id: 'tricep-pushdown',   name: 'Tricep Pushdown',        category: 'arms',      defaultSets: 3, defaultReps: 15, icon: 'cable' },
  { id: 'overhead-tricep',   name: 'Overhead Tricep Ext.',   category: 'arms',      defaultSets: 3, defaultReps: 12, icon: 'dumbbell' },
  { id: 'close-grip-bench',  name: 'Close-Grip Bench',       category: 'arms',      defaultSets: 3, defaultReps: 10, icon: 'barbell' },

  // ── LEGS ──────────────────────────────────────────────────
  { id: 'squat',             name: 'Squat',                  category: 'legs',      defaultSets: 4, defaultReps: 8,  icon: 'squat' },
  { id: 'leg-press',         name: 'Leg Press',              category: 'legs',      defaultSets: 3, defaultReps: 12, icon: 'legpress' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift',      category: 'legs',      defaultSets: 3, defaultReps: 10, icon: 'deadlift' },
  { id: 'lunge',             name: 'Lunge',                  category: 'legs',      defaultSets: 3, defaultReps: 12, icon: 'lunge' },
  { id: 'leg-curl',          name: 'Leg Curl',               category: 'legs',      defaultSets: 3, defaultReps: 12, icon: 'cable' },
  { id: 'leg-extension',     name: 'Leg Extension',          category: 'legs',      defaultSets: 3, defaultReps: 12, icon: 'cable' },
  { id: 'calf-raise',        name: 'Calf Raise',             category: 'legs',      defaultSets: 4, defaultReps: 15, icon: 'calfrise' },
  { id: 'hack-squat',        name: 'Hack Squat',             category: 'legs',      defaultSets: 3, defaultReps: 10, icon: 'squat' },
  { id: 'sumo-deadlift',     name: 'Sumo Deadlift',          category: 'legs',      defaultSets: 3, defaultReps: 6,  icon: 'deadlift' },
  { id: 'box-jump',          name: 'Box Jump',               category: 'legs',      defaultSets: 3, defaultReps: 10, icon: 'lunge' },

  // ── CORE ──────────────────────────────────────────────────
  { id: 'plank',             name: 'Plank',                  category: 'core',      defaultSets: 3, defaultReps: 1,  icon: 'plank' },
  { id: 'crunch',            name: 'Crunch',                 category: 'core',      defaultSets: 3, defaultReps: 20, icon: 'crunch' },
  { id: 'russian-twist',     name: 'Russian Twist',          category: 'core',      defaultSets: 3, defaultReps: 20, icon: 'crunch' },
  { id: 'leg-raise',         name: 'Leg Raise',              category: 'core',      defaultSets: 3, defaultReps: 15, icon: 'crunch' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise',      category: 'core',      defaultSets: 3, defaultReps: 12, icon: 'pullup' },
  { id: 'ab-wheel',          name: 'Ab Wheel Rollout',       category: 'core',      defaultSets: 3, defaultReps: 10, icon: 'plank' },
  { id: 'cable-crunch',      name: 'Cable Crunch',           category: 'core',      defaultSets: 3, defaultReps: 15, icon: 'cable' },
  { id: 'mountain-climber',  name: 'Mountain Climber',       category: 'core',      defaultSets: 3, defaultReps: 20, icon: 'plank' },
  { id: 'bicycle-crunch',    name: 'Bicycle Crunch',         category: 'core',      defaultSets: 3, defaultReps: 20, icon: 'crunch' },
]

export function getExercise(id) {
  return EXERCISES.find(e => e.id === id)
}

export function getExercisesByCategory() {
  const grouped = {}
  for (const cat of Object.keys(CATEGORIES)) {
    grouped[cat] = EXERCISES.filter(e => e.category === cat)
  }
  return grouped
}
