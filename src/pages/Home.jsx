import { useState } from 'react'
import { Plus, ChevronRight, Play, Pencil, Trash2, Zap } from 'lucide-react'
import { CATEGORIES, getExercise } from '../data/exercises.js'
import { ExerciseIcon } from '../components/ExerciseIcon.jsx'

function WorkoutCard({ workout, onStart, onEdit, onDelete, hasActiveSession }) {
  const [showConfirm, setShowConfirm] = useState(false)

  // Collect unique muscle group colors from exercises
  const cats = [...new Set(
    workout.exercises.map(e => getExercise(e.exerciseId)?.category).filter(Boolean)
  )]

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border-subtle animate-fade-in">
      {/* Header row */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white leading-tight truncate">{workout.name}</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {workout.exercises.length === 0
              ? 'No exercises yet'
              : `${workout.exercises.length} exercise${workout.exercises.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Category color dots */}
        <div className="flex gap-1.5 pt-1 flex-shrink-0">
          {cats.slice(0, 4).map(cat => (
            <span
              key={cat}
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORIES[cat]?.color }}
              title={CATEGORIES[cat]?.name}
            />
          ))}
        </div>
      </div>

      {/* Exercise preview icons */}
      {workout.exercises.length > 0 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {workout.exercises.slice(0, 6).map(ex => (
            <ExerciseIcon key={ex.id} exerciseId={ex.exerciseId} size="sm" />
          ))}
          {workout.exercises.length > 6 && (
            <div className="w-9 h-9 rounded-xl bg-elevated flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-zinc-500 font-medium">+{workout.exercises.length - 6}</span>
            </div>
          )}
        </div>
      )}

      {/* Action row */}
      <div className="flex border-t border-border-subtle">
        {/* Delete */}
        {showConfirm ? (
          <div className="flex-1 flex">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 text-sm text-zinc-400"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(workout.id)}
              className="flex-1 py-3 text-sm font-semibold text-red-500"
            >
              Delete
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-3.5 text-zinc-600 hover:text-red-500 transition-colors press-effect"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => onEdit(workout.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors press-effect"
            >
              <Pencil size={15} />
              Edit
            </button>
            <button
              onClick={() => onStart(workout)}
              disabled={hasActiveSession}
              className="flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-br-2xl transition-colors press-effect"
              style={
                hasActiveSession
                  ? { color: '#6b7280', backgroundColor: '#1c1c1c' }
                  : { color: '#0a0a0a', backgroundColor: '#ef4444' }
              }
            >
              <Play size={14} fill="currentColor" />
              Start
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function Home({ workouts, onStart, onEdit, onDeleteWorkout, onNewWorkout, session, onGoToSession }) {
  const hasActiveSession = !!session

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex-shrink-0 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">GymLog</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {workouts.length === 0
                ? 'Build your first workout'
                : `${workouts.length} workout${workouts.length !== 1 ? ' days' : ' day'}`}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}
          >
            <span className="text-xl">💪</span>
          </div>
        </div>
      </header>

      {/* Active session banner */}
      {hasActiveSession && (
        <button
          onClick={onGoToSession}
          className="mx-5 mb-4 flex-shrink-0 rounded-2xl overflow-hidden press-effect"
          style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-red-400">Session in progress</p>
              <p className="text-xs text-red-400/70 mt-0.5">{session.workoutName}</p>
            </div>
            <Zap size={18} className="text-red-500" />
          </div>
        </button>
      )}

      {/* Workout list */}
      <div className="flex-1 scroll-area px-5 pb-6">
        {workouts.length === 0 ? (
          <EmptyState onNew={onNewWorkout} />
        ) : (
          <div className="flex flex-col gap-4">
            {workouts.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={onStart}
                onEdit={onEdit}
                onDelete={onDeleteWorkout}
                hasActiveSession={hasActiveSession}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onNewWorkout}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg press-effect z-10"
        style={{ backgroundColor: '#ef4444' }}
      >
        <Plus size={26} color="white" strokeWidth={2.5} />
      </button>
    </div>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}
      >
        <span className="text-4xl">🏋️</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No workouts yet</h3>
      <p className="text-zinc-500 text-sm mb-8 max-w-[220px] leading-relaxed">
        Create your first workout day and start training
      </p>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white press-effect"
        style={{ backgroundColor: '#ef4444' }}
      >
        <Plus size={18} />
        Create Workout
      </button>
    </div>
  )
}
