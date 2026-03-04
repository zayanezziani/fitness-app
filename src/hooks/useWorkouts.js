import { useState, useCallback } from 'react'
import { storage } from '../utils/storage.js'
import { uid } from '../utils/id.js'

// Sample workouts shown on first launch
const SAMPLE_WORKOUTS = [
  {
    id: 'sample-back',
    name: 'Back Day',
    exercises: [
      { id: uid(), exerciseId: 'deadlift',         sets: 3, reps: 5  },
      { id: uid(), exerciseId: 'pull-up',           sets: 3, reps: 8  },
      { id: uid(), exerciseId: 'bent-over-row',     sets: 4, reps: 8  },
      { id: uid(), exerciseId: 'lat-pulldown',      sets: 3, reps: 12 },
      { id: uid(), exerciseId: 'seated-cable-row',  sets: 3, reps: 12 },
    ],
  },
  {
    id: 'sample-chest',
    name: 'Chest Day',
    exercises: [
      { id: uid(), exerciseId: 'bench-press',       sets: 4, reps: 8  },
      { id: uid(), exerciseId: 'incline-bench',     sets: 3, reps: 10 },
      { id: uid(), exerciseId: 'dumbbell-press',    sets: 3, reps: 10 },
      { id: uid(), exerciseId: 'chest-fly',         sets: 3, reps: 12 },
      { id: uid(), exerciseId: 'cable-crossover',   sets: 3, reps: 12 },
    ],
  },
  {
    id: 'sample-push',
    name: 'Shoulders & Arms',
    exercises: [
      { id: uid(), exerciseId: 'overhead-press',    sets: 4, reps: 8  },
      { id: uid(), exerciseId: 'lateral-raise',     sets: 4, reps: 15 },
      { id: uid(), exerciseId: 'bicep-curl',        sets: 3, reps: 12 },
      { id: uid(), exerciseId: 'hammer-curl',       sets: 3, reps: 12 },
      { id: uid(), exerciseId: 'tricep-pushdown',   sets: 3, reps: 15 },
    ],
  },
  {
    id: 'sample-legs',
    name: 'Leg Day',
    exercises: [
      { id: uid(), exerciseId: 'squat',             sets: 4, reps: 8  },
      { id: uid(), exerciseId: 'romanian-deadlift', sets: 3, reps: 10 },
      { id: uid(), exerciseId: 'leg-press',         sets: 3, reps: 12 },
      { id: uid(), exerciseId: 'lunge',             sets: 3, reps: 12 },
      { id: uid(), exerciseId: 'calf-raise',        sets: 4, reps: 15 },
    ],
  },
]

function loadInitial() {
  const saved = storage.getWorkouts()
  if (saved.length > 0) return saved
  storage.saveWorkouts(SAMPLE_WORKOUTS)
  return SAMPLE_WORKOUTS
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(loadInitial)

  const persist = useCallback((nextOrUpdater) => {
    if (typeof nextOrUpdater === 'function') {
      setWorkouts(prev => {
        const next = nextOrUpdater(prev)
        storage.saveWorkouts(next)
        return next
      })
    } else {
      setWorkouts(nextOrUpdater)
      storage.saveWorkouts(nextOrUpdater)
    }
  }, [])

  const createWorkout = useCallback((name) => {
    const w = { id: uid(), name, exercises: [] }
    persist(prev => [...prev, w])
    return w.id
  }, [persist])

  const updateWorkout = useCallback((id, patch) => {
    persist(prev => prev.map(w => w.id === id ? { ...w, ...patch } : w))
  }, [persist])

  const deleteWorkout = useCallback((id) => {
    persist(prev => prev.filter(w => w.id !== id))
  }, [persist])

  const saveExercises = useCallback((workoutId, exercises) => {
    persist(prev => prev.map(w => w.id === workoutId ? { ...w, exercises } : w))
  }, [persist])

  return { workouts, createWorkout, updateWorkout, deleteWorkout, saveExercises }
}
