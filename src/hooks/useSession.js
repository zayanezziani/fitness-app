import { useState, useCallback } from 'react'
import { storage } from '../utils/storage.js'
import { uid } from '../utils/id.js'

function buildSessionExercises(workoutExercises) {
  return workoutExercises.map(ex => ({
    workoutExerciseId: ex.id,
    exerciseId: ex.exerciseId,
    targetReps: ex.reps,
    sets: Array.from({ length: ex.sets }, (_, i) => ({
      index: i,
      completed: false,
      reps: 0, // actual reps done
    })),
  }))
}

export function useSession() {
  const [session, setSession] = useState(() => storage.getSession())

  const persist = useCallback((next) => {
    setSession(next)
    if (next) storage.saveSession(next)
    else storage.clearSession()
  }, [])

  const startSession = useCallback((workout) => {
    const s = {
      id: uid(),
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: new Date().toISOString(),
      exercises: buildSessionExercises(workout.exercises),
    }
    persist(s)
    return s
  }, [persist])

  // Toggle set completion: marks complete with target reps, or uncompletes
  const completeSet = useCallback((exerciseIndex, setIndex) => {
    setSession(prev => {
      if (!prev) return prev
      const exercises = prev.exercises.map((ex, ei) => {
        if (ei !== exerciseIndex) return ex
        const sets = ex.sets.map((s, si) => {
          if (si !== setIndex) return s
          if (s.completed) {
            return { ...s, completed: false, reps: 0 }
          }
          return { ...s, completed: true, reps: s.reps || ex.targetReps }
        })
        return { ...ex, sets }
      })
      const next = { ...prev, exercises }
      storage.saveSession(next)
      return next
    })
  }, [])

  // Update reps for a specific set
  const updateSetReps = useCallback((exerciseIndex, setIndex, reps) => {
    setSession(prev => {
      if (!prev) return prev
      const exercises = prev.exercises.map((ex, ei) => {
        if (ei !== exerciseIndex) return ex
        const sets = ex.sets.map((s, si) =>
          si === setIndex ? { ...s, reps: Math.max(0, reps) } : s
        )
        return { ...ex, sets }
      })
      const next = { ...prev, exercises }
      storage.saveSession(next)
      return next
    })
  }, [])

  const endSession = useCallback(() => {
    if (!session) return
    const completed = {
      ...session,
      completedAt: new Date().toISOString(),
    }
    const history = storage.getHistory()
    storage.saveHistory([completed, ...history].slice(0, 50))
    persist(null)
  }, [session, persist])

  const discardSession = useCallback(() => {
    persist(null)
  }, [persist])

  // Computed progress
  const progress = session
    ? (() => {
        const total = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
        const done  = session.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)
        const totalReps = session.exercises.reduce((acc, ex) => acc + ex.sets.reduce((a, s) => a + (s.reps || 0), 0), 0)
        return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100), totalReps }
      })()
    : null

  const currentExerciseIndex = session
    ? session.exercises.findIndex(ex => ex.sets.some(s => !s.completed))
    : -1

  const isComplete = session
    ? session.exercises.every(ex => ex.sets.every(s => s.completed))
    : false

  return {
    session,
    startSession,
    endSession,
    discardSession,
    completeSet,
    updateSetReps,
    progress,
    currentExerciseIndex,
    isComplete,
  }
}
